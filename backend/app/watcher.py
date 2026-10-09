"""
Ambient Workspace Watcher for SynapseOS.
Continuously monitors local workspace files, notes, and code,
automatically sanitizing and indexing them into the contextual memory store.
"""

import os
import time
import threading
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent, FileCreatedEvent
from app.config import settings
from app.memory_store import memory_store

# Supported file extensions for ambient indexing
SUPPORTED_EXTENSIONS = {".md", ".txt", ".py", ".ts", ".js", ".json", ".yaml", ".yml", ".html"}
MAX_FILE_SIZE_BYTES = 100 * 1024  # 100 KB limit per file to avoid huge binaries

class WorkspaceEventHandler(FileSystemEventHandler):
    def __init__(self, watch_dir: str):
        super().__init__()
        self.watch_dir = Path(watch_dir)
        self._last_processed = {}

    def _should_process(self, path_str: str) -> bool:
        path = Path(path_str)
        if path.is_dir():
            return False
        if any(part.startswith(".") for part in path.parts):
            return False
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            return False
        return True

    def _process_file(self, file_path_str: str):
        if not self._should_process(file_path_str):
            return

        now = time.time()
        # Debounce rapid file write events (within 1.5 seconds)
        if file_path_str in self._last_processed and (now - self._last_processed[file_path_str]) < 1.5:
            return
        self._last_processed[file_path_str] = now

        try:
            path = Path(file_path_str)
            if not path.exists():
                return
            if path.stat().st_size > MAX_FILE_SIZE_BYTES:
                return

            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            if not content.strip():
                return

            relative_name = str(path.relative_to(self.watch_dir)) if path.is_relative_to(self.watch_dir) else path.name
            memory_store.add_context_item(
                item_type="file",
                title=relative_name,
                content=content,
                metadata={
                    "file_path": str(path),
                    "extension": path.suffix.lower(),
                    "size_bytes": len(content)
                }
            )
            print(f"[SynapseOS Watcher] Indexed: {relative_name}")
        except Exception as e:
            print(f"[SynapseOS Watcher] Error processing {file_path_str}: {e}")

    def on_modified(self, event):
        if isinstance(event, FileModifiedEvent) and not event.is_directory:
            self._process_file(event.src_path)

    def on_created(self, event):
        if isinstance(event, FileCreatedEvent) and not event.is_directory:
            self._process_file(event.src_path)

class AmbientWatcher:
    def __init__(self, watch_dir: str = None):
        self.watch_dir = watch_dir or settings.watch_directory
        self.observer = None
        self._is_running = False

    def scan_existing_files(self):
        """Initial pass to index any existing files upon startup."""
        path = Path(self.watch_dir)
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)
            return

        handler = WorkspaceEventHandler(self.watch_dir)
        for root, dirs, files in os.walk(path):
            dirs[:] = [d for d in dirs if not d.startswith(".")]
            for file in files:
                file_path = os.path.join(root, file)
                handler._process_file(file_path)

    def start(self):
        if self._is_running:
            return

        path = Path(self.watch_dir)
        path.mkdir(parents=True, exist_ok=True)

        self.scan_existing_files()

        event_handler = WorkspaceEventHandler(self.watch_dir)
        self.observer = Observer()
        self.observer.schedule(event_handler, str(path), recursive=True)
        self.observer.start()
        self._is_running = True
        print(f"[SynapseOS Watcher] Ambient monitoring started on: {self.watch_dir}")

    def stop(self):
        if self.observer and self._is_running:
            self.observer.stop()
            self.observer.join()
            self._is_running = False
            print("[SynapseOS Watcher] Ambient monitoring stopped.")

ambient_watcher = AmbientWatcher()
