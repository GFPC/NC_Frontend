from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(title="Cinema Booking API")

# CORS - Allow all origins for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database
seats_db = []
ROWS = 8
COLS = 10
PRICE_STANDARD = 12
PRICE_VIP = 18

def init_seats():
    global seats_db
    seats_db = []
    for r in range(1, ROWS + 1):
        for c in range(1, COLS + 1):
            is_vip = r >= ROWS - 1
            seats_db.append({
                "id": f"{r}-{c}",
                "row": r,
                "col": c,
                "price": PRICE_VIP if is_vip else PRICE_STANDARD,
                "status": "available",
                "type": "vip" if is_vip else "standard",
                "occupied_by": None,
                "held_by": None,
            })

init_seats()

@app.get("/")
async def root():
    return {"message": "Cinema Booking API", "status": "running"}

@app.get("/api/seats")
async def get_seats():
    return {"seats": seats_db}

@app.post("/api/seats/reserve")
async def reserve_seat(
    seat_id: str = Form(...),
    user_id: str = Form(...)
):
    seat = next((s for s in seats_db if s["id"] == seat_id), None)
    
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    if seat["status"] == "occupied" and seat["held_by"] != user_id:
        return {
            "success": False,
            "message": f"Seat already taken by {seat['occupied_by'] or 'another user'}"
        }
    
    seat["status"] = "occupied"
    seat["held_by"] = user_id
    seat["occupied_by"] = None
    
    return {"success": True, "message": "Seat reserved"}

@app.post("/api/seats/release")
async def release_seat(
    seat_id: str = Form(...),
    user_id: str = Form(...)
):
    seat = next((s for s in seats_db if s["id"] == seat_id), None)
    
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    
    if seat["held_by"] == user_id:
        seat["status"] = "available"
        seat["held_by"] = None
        seat["occupied_by"] = None
    
    return {"success": True, "message": "Seat released"}

@app.post("/api/seats/book")
async def book_seats(
    user_id: str = Form(...),
    seat_ids: str = Form(...),
    name: str = Form(...)
):
    seat_id_list = seat_ids.split(",")
    user_seats = [s for s in seats_db if s["id"] in seat_id_list]
    
    if not all(s["held_by"] == user_id for s in user_seats):
        return {
            "success": False,
            "message": "Reservation expired or invalid"
        }
    
    for seat in user_seats:
        seat["status"] = "occupied"
        seat["held_by"] = None
        seat["occupied_by"] = name
    
    return {"success": True, "message": "Booking successful!"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
