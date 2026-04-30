# MediConnect AI predictor (Flask)

Disease suggestion from symptoms (learning project — not medical advice).

## Run (use your Mac’s Python)

Cursor does not ship Python for your project. Use **Terminal** with `python3` from Homebrew or [python.org](https://www.python.org/downloads/).

```bash
cd ai-predictor-dataset
chmod +x run.sh    # once
./run.sh
```

Or manually:

```bash
cd ai-predictor-dataset
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python3 train_and_export.py   # creates svc.pkl
python3 api.py                # http://127.0.0.1:5001
```

In Cursor: **Command Palette** → **Python: Select Interpreter** → choose `ai-predictor-dataset/.venv/bin/python` after the venv exists.

The React app uses `VITE_PREDICTOR_URL` (default `http://localhost:5001`).
