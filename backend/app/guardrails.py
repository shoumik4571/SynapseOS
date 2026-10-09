"""
NVIDIA NeMo-Inspired Privacy Guardrails & Secret Scrubber.
Protects sensitive personal information and developer credentials
locally before sending context to cloud inference endpoints.
"""

import re
from typing import Tuple, List, Dict, Any

class PrivacyGuardrail:
    # High-accuracy regex patterns for secret detection
    PATTERNS: Dict[str, re.Pattern] = {
        "nebius_api_key": re.compile(r"v1\.[A-Za-z0-9_\-\.]{50,}", re.IGNORECASE),
        "openai_api_key": re.compile(r"sk-[a-zA-Z0-9]{20,}", re.IGNORECASE),
        "github_token": re.compile(r"gh[pousr]_[A-Za-z0-9_]{36,}", re.IGNORECASE),
        "aws_access_key": re.compile(r"AKIA[0-9A-Z]{16}"),
        "private_key": re.compile(r"-----BEGIN [A-Z ]+PRIVATE KEY-----[^-]+-----END [A-Z ]+PRIVATE KEY-----", re.DOTALL),
        "connection_string": re.compile(r"(postgres|mysql|mongodb|redis):\/\/[a-zA-Z0-9_\-\.]+:[^@\s]+@[a-zA-Z0-9_\-\.:]+", re.IGNORECASE),
        "jwt_or_bearer": re.compile(r"Bearer\s+ey[A-Za-z0-9_\-\.]{20,}", re.IGNORECASE),
        "generic_secret": re.compile(r'(?:api_key|secret|password|auth_token)\s*[:=]\s*["\']([a-zA-Z0-9_\-]{16,})["\']', re.IGNORECASE),
        "email_address": re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"),
        "ssn": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
        "credit_card": re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b"),
    }

    @classmethod
    def sanitize(cls, text: str) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Sanitizes text by redacting sensitive secrets and PII.
        Returns:
            sanitized_text: Safe version with [REDACTED_<TYPE>] placeholders.
            redacted_records: List of detected violation metadata.
        """
        if not text:
            return "", []

        sanitized = text
        redacted_records = []

        for category, pattern in cls.PATTERNS.items():
            matches = list(pattern.finditer(sanitized))
            for match in reversed(matches):
                matched_str = match.group(0)
                # Keep first 2 and last 2 characters for debugging if safe, or fully redact
                placeholder = f"[REDACTED_{category.upper()}]"
                start, end = match.span()
                sanitized = sanitized[:start] + placeholder + sanitized[end:]

                redacted_records.append({
                    "category": category,
                    "length": len(matched_str),
                    "placeholder": placeholder,
                })

        return sanitized, redacted_records

    @classmethod
    def is_safe_for_cloud(cls, text: str) -> bool:
        """Checks if text contains zero raw high-risk credentials."""
        for name, pattern in cls.PATTERNS.items():
            if name in ["nebius_api_key", "openai_api_key", "github_token", "private_key", "connection_string"]:
                if pattern.search(text):
                    return False
        return True
