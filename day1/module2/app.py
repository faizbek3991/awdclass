from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from pathlib import Path

app = FastAPI(
    title="FARM Stack Module 2 - Python and FastAPI",
    description="FastAPI backend for greetings and arithmetic operations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class GreetRequest(BaseModel):
    name: str
    live: str = ""

class CalcRequest(BaseModel):
    num1: float
    num2: float
    operation: str  # "add", "subtract", "multiply", "divide", "power"

# API Endpoints
@app.post("/api/greet")
def greet(req: GreetRequest):
    name = req.name.strip()
    live = req.live.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")
    
    if live:
        message = f"Hello {name}, welcome back! {live} is a wonderful place. Hope you are enjoying your time in {live}!"
    else:
        message = f"Hello {name}, welcome to FARM Stack Module 2!"
    
    return {"success": True, "message": message, "name": name, "live": live}

@app.post("/api/calculate")
def calculate(req: CalcRequest):
    num1 = req.num1
    num2 = req.num2
    op = req.operation.lower()
    
    if op in ("add", "+", "plus"):
        res = num1 + num2
        symbol = "+"
    elif op in ("subtract", "-", "minus"):
        res = num1 - num2
        symbol = "-"
    elif op in ("multiply", "*", "times"):
        res = num1 * num2
        symbol = "*"
    elif op in ("divide", "/", "div"):
        if num2 == 0:
            raise HTTPException(status_code=400, detail="Cannot divide by zero!")
        res = num1 / num2
        symbol = "/"
    elif op in ("power", "**", "pow", "exponent"):
        res = num1 ** num2
        symbol = "**"
    else:
        raise HTTPException(status_code=400, detail=f"Unknown operation: {op}")

    rounded = round(res, 2)
    expression = f"{num1} {symbol} {num2} = {rounded}"
    
    return {
        "success": True,
        "result": rounded,
        "expression": expression,
        "num1": num1,
        "num2": num2,
        "operation": op
    }

# Serve frontend static files
CURRENT_DIR = Path(__file__).parent.resolve()

@app.get("/")
def serve_index():
    index_file = CURRENT_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "FARM Module 2 API is running. index.html not found."}

app.mount("/static", StaticFiles(directory=str(CURRENT_DIR)), name="static")

if __name__ == "__main__":
    print("Starting Module 2 server on http://127.0.0.1:8000 ...")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
