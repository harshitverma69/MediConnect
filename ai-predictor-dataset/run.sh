#!/usr/bin/env bash
# Run from macOS Terminal or Cursor terminal (not dependent on Cursor bundling Python).
set -e
cd "$(dirname "$0")"

if ! command -v python3 &>/dev/null; then
  echo "python3 not found. Install Python 3:"
  echo "  brew install python"
  echo "  or download from https://www.python.org/downloads/"
  exit 1
fi

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [[ ! -f svc.pkl ]]; then
  echo "Training model (writes svc.pkl)..."
  python3 train_and_export.py
fi

echo "Starting API on http://127.0.0.1:5001"
exec python3 api.py
