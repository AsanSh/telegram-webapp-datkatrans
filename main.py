from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

# Модель данных для заявки
class Request(BaseModel):
    driver_name: str
    driver_phone: str
    car_number: str
    cargo_type: str
    arrival_date: str
    arrival_time: str
    comment: Optional[str] = None
    created_at: Optional[str] = None
    status: str = 'pending'
    id: Optional[str] = None

app = FastAPI()

# Mount static files and setup templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Путь к файлу для хранения данных
REQUESTS_FILE = "requests_data.json"

# Функция для загрузки данных из файла
def load_requests():
    try:
        if os.path.exists(REQUESTS_FILE):
            with open(REQUESTS_FILE, 'r') as file:
                return json.load(file)
        return []
    except Exception as e:
        print(f"Error loading requests: {e}")
        return []

# Функция для сохранения данных в файл
def save_requests(requests):
    try:
        with open(REQUESTS_FILE, 'w') as file:
            json.dump(requests, file, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving requests: {e}")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/requests")
async def get_requests():
    requests = load_requests()
    return JSONResponse(content=requests)

@app.post("/api/requests")
async def create_request(request: Request):
    requests = load_requests()
    
    # Добавляем timestamp если его нет
    if not request.created_at:
        request.created_at = datetime.now().isoformat()
    
    # Генерируем ID если его нет
    if not request.id:
        request.id = f"request-{int(datetime.now().timestamp() * 1000)}"
    
    # Добавляем новую заявку
    request_dict = request.dict()
    requests.append(request_dict)
    
    # Сохраняем обновленный список
    save_requests(requests)
    
    return JSONResponse(content=request_dict)

@app.get("/api/request-counts")
async def get_request_counts():
    requests = load_requests()
    return {
        "total": len(requests),
        "pending": len([r for r in requests if r["status"] == "pending"]),
        "closed": len([r for r in requests if r["status"] == "closed"]),
        "cancelled": len([r for r in requests if r["status"] == "cancelled"])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 