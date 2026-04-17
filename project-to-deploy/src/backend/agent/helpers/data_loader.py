"""Shared utility: parse JS data files into Python objects."""
from __future__ import annotations

import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def parse_js_export(path: Path) -> list | dict:
    """
    Parse a JS file of the form  `const X = [...]; export default X;`
    and return the equivalent Python object.

    Handles:
    - Block comments  /* ... */
    - Line comments   // ...
    - Unquoted object keys
    - Single-quoted string values
    - Trailing commas
    - Inline objects on the same line  { key: 'val', key2: 'val2' }
    """
    text = path.read_text(encoding="utf-8")

    # Remove block comments
    text = re.sub(r"/\*[\s\S]*?\*/", "", text)
    # Remove line comments
    text = re.sub(r"//[^\n]*", "", text)
    # Remove  const/let/var X =  prefix
    text = re.sub(r"^\s*(?:const|let|var)\s+\w+\s*=\s*", "", text.strip())
    # Remove  export default X;  suffix
    text = re.sub(r"\s*export\s+default\s+\w+\s*;?\s*$", "", text.strip())
    text = text.strip().rstrip(";").strip()

    # Quote unquoted keys at the start of lines
    text = re.sub(r"^(\s*)([a-zA-Z_]\w*)(\s*:)", r'\1"\2"\3', text, flags=re.MULTILINE)
    # Quote unquoted keys inline after  {  or  ,
    text = re.sub(r"([{,]\s*)([a-zA-Z_]\w*)(\s*:)", r'\1"\2"\3', text)

    # Convert single-quoted strings to double-quoted JSON strings
    text = re.sub(r"'([^']*)'", r'"\1"', text)

    # Remove trailing commas before  }  or  ]
    text = re.sub(r",(\s*[}\]])", r"\1", text)

    return json.loads(text)
