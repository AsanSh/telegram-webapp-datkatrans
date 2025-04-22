# FastAPI Project

A simple FastAPI project with example endpoints.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

The application will be available at http://localhost:8000

## API Endpoints

- GET `/`: Welcome message
- GET `/items/{item_id}`: Get item by ID
- POST `/items/`: Create a new item

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 