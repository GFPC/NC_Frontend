# Cinema Booking API - Backend

FastAPI backend for the cinema seat booking system.

## Deploy to Render.com

1. Create a new **Web Service** on Render
2. Connect your GitHub/GitLab repository (or use the backend folder)
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Deploy!

## After Deployment

1. Copy your Render URL (e.g., `https://cinema-api.onrender.com`)
2. Set environment variable in frontend:
   ```
   VITE_API_URL=https://cinema-api.onrender.com/api
   ```

## API Endpoints

- `GET /api/seats` - Get all seats
- `POST /api/seats/reserve` - Reserve a seat (form: seat_id, user_id)
- `POST /api/seats/release` - Release a seat (form: seat_id, user_id)
- `POST /api/seats/book` - Book seats (form: user_id, seat_ids, name)

## Local Development

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Server runs on http://localhost:8000
