
### Setup Frontend

### 1. React

Run

```bash
cd frontend
npm i
npm start
```

### 2. Flask

Run

```bash
cd frontend
python3 -m venv .venv
.venv/Scripts/activate

cd backend
pip install "requirements.txt"
python sensor_app.py
cd ..
npm start
```
