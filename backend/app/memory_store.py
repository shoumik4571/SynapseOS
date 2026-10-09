"""
Hybrid Contextual Memory Store for SynapseOS.
Manages local SQLite storage for notes, ambient workspace files,
quick captures, and session history with automatic privacy sanitization.
"""

import json
import sqlite3
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.config import settings
from app.guardrails import PrivacyGuardrail

class MemoryStore:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Context items (files, notes, quick captures, git diffs)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS context_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_type TEXT NOT NULL, -- 'file', 'note', 'thought', 'task', 'diff'
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    sanitized_content TEXT NOT NULL,
                    metadata_json TEXT DEFAULT '{}',
                    redactions_count INTEGER DEFAULT 0,
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
            """)
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_context_type ON context_items(item_type)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_context_created ON context_items(created_at)")

            # Chat history & streaming metrics
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metrics_json TEXT DEFAULT '{}',
                    created_at REAL NOT NULL
                )
            """)
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id)")

            # Daily executive briefings
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS briefings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date_str TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    priorities_json TEXT NOT NULL,
                    open_loops_json TEXT NOT NULL,
                    metrics_json TEXT DEFAULT '{}',
                    created_at REAL NOT NULL
                )
            """)

            # High-level goals & autonomous decompositions
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS goals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    target_date TEXT,
                    status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
                    decomposition_json TEXT DEFAULT '{}',
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
            """)
            conn.commit()

    def add_context_item(self, item_type: str, title: str, content: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Sanitizes content and stores context item."""
        sanitized_content, redactions = PrivacyGuardrail.sanitize(content)
        metadata = metadata or {}
        now = time.time()

        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Update existing file item if matching title and type
            if item_type == "file":
                cursor.execute(
                    "SELECT id FROM context_items WHERE item_type = ? AND title = ?",
                    (item_type, title)
                )
                existing = cursor.fetchone()
                if existing:
                    cursor.execute("""
                        UPDATE context_items
                        SET content = ?, sanitized_content = ?, metadata_json = ?,
                            redactions_count = ?, updated_at = ?
                        WHERE id = ?
                    """, (content, sanitized_content, json.dumps(metadata), len(redactions), now, existing["id"]))
                    conn.commit()
                    return {"id": existing["id"], "action": "updated", "redactions": len(redactions)}

            cursor.execute("""
                INSERT INTO context_items (
                    item_type, title, content, sanitized_content, metadata_json, redactions_count, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item_type, title, content, sanitized_content, json.dumps(metadata), len(redactions), now, now
            ))
            conn.commit()
            item_id = cursor.lastrowid

        return {
            "id": item_id,
            "action": "created",
            "item_type": item_type,
            "title": title,
            "redactions": len(redactions),
            "created_at": now
        }

    def get_recent_items(self, limit: int = 25, item_type: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if item_type:
                cursor.execute("""
                    SELECT * FROM context_items 
                    WHERE item_type = ? 
                    ORDER BY updated_at DESC LIMIT ?
                """, (item_type, limit))
            else:
                cursor.execute("""
                    SELECT * FROM context_items 
                    ORDER BY updated_at DESC LIMIT ?
                """, (limit,))
            rows = cursor.fetchall()

        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "item_type": r["item_type"],
                "title": r["title"],
                "sanitized_content": r["sanitized_content"],
                "metadata": json.loads(r["metadata_json"] or "{}"),
                "redactions_count": r["redactions_count"],
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            })
        return results

    def search_context(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Hybrid search with token matching and recency weighting."""
        tokens = [t.lower() for t in query.split() if len(t) > 2]
        if not tokens:
            return self.get_recent_items(limit=limit)

        all_items = self.get_recent_items(limit=100)
        scored = []
        now = time.time()

        for item in all_items:
            text = (item["title"] + " " + item["sanitized_content"]).lower()
            token_matches = sum(1 for t in tokens if t in text)
            if token_matches > 0:
                # Recency score decay over 7 days
                age_hours = (now - item["updated_at"]) / 3600.0
                recency_boost = max(0.2, 1.0 - (age_hours / 168.0))
                total_score = (token_matches * 2.0) + recency_boost
                scored.append((total_score, item))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored[:limit]]

    def save_chat_message(self, session_id: str, role: str, content: str, metrics: Dict[str, Any] = None):
        sanitized_content, _ = PrivacyGuardrail.sanitize(content)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO chat_history (session_id, role, content, metrics_json, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (session_id, role, sanitized_content, json.dumps(metrics or {}), time.time()))
            conn.commit()

    def get_chat_history(self, session_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM chat_history
                WHERE session_id = ?
                ORDER BY created_at ASC LIMIT ?
            """, (session_id, limit))
            rows = cursor.fetchall()

        return [{
            "id": r["id"],
            "role": r["role"],
            "content": r["content"],
            "metrics": json.loads(r["metrics_json"] or "{}"),
            "created_at": r["created_at"]
        } for r in rows]

    def save_briefing(self, date_str: str, summary: str, priorities: List[str], open_loops: List[str], metrics: Dict[str, Any] = None) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO briefings (date_str, summary, priorities_json, open_loops_json, metrics_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                date_str, summary, json.dumps(priorities), json.dumps(open_loops), json.dumps(metrics or {}), time.time()
            ))
            conn.commit()
            return cursor.lastrowid

    def get_latest_briefing(self) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM briefings ORDER BY created_at DESC LIMIT 1")
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "id": row["id"],
                "date_str": row["date_str"],
                "summary": row["summary"],
                "priorities": json.loads(row["priorities_json"] or "[]"),
                "open_loops": json.loads(row["open_loops_json"] or "[]"),
                "metrics": json.loads(row["metrics_json"] or "{}"),
                "created_at": row["created_at"]
            }

    def get_stats(self) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM context_items")
            total_items = cursor.fetchone()[0]

            cursor.execute("SELECT item_type, COUNT(*) FROM context_items GROUP BY item_type")
            by_type = dict(cursor.fetchall())

            cursor.execute("SELECT SUM(redactions_count) FROM context_items")
            total_redactions = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM chat_history")
            total_chats = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM goals WHERE status = 'active'")
            active_goals = cursor.fetchone()[0]

        return {
            "total_items": total_items,
            "by_type": by_type,
            "total_redactions": total_redactions,
            "total_chats": total_chats,
            "active_goals": active_goals,
        }

    def save_goal(self, title: str, decomposition: Dict[str, Any], target_date: str = "", goal_id: Optional[int] = None) -> int:
        now = time.time()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if goal_id:
                cursor.execute("""
                    UPDATE goals
                    SET title = ?, decomposition_json = ?, target_date = ?, updated_at = ?
                    WHERE id = ?
                """, (title, json.dumps(decomposition), target_date, now, goal_id))
                conn.commit()
                return goal_id
            else:
                cursor.execute("""
                    INSERT INTO goals (title, target_date, status, decomposition_json, created_at, updated_at)
                    VALUES (?, ?, 'active', ?, ?, ?)
                """, (title, target_date, json.dumps(decomposition), now, now))
                conn.commit()
                return cursor.lastrowid

    def get_goals(self, status: str = "active") -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM goals WHERE status = ? ORDER BY created_at DESC", (status,))
            rows = cursor.fetchall()

        return [{
            "id": r["id"],
            "title": r["title"],
            "target_date": r["target_date"],
            "status": r["status"],
            "decomposition": json.loads(r["decomposition_json"] or "{}"),
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        } for r in rows]

    def update_goal_status(self, goal_id: int, status: str):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE goals SET status = ?, updated_at = ? WHERE id = ?", (status, time.time(), goal_id))
            conn.commit()

memory_store = MemoryStore()
