// Real API client (replaces mockApi.ts)

export interface Seat {
  id: string;
  row: number;
  col: number;
  price: number;
  status: 'available' | 'occupied';
  type: 'standard' | 'vip';
  occupied_by?: string | null;
  held_by?: string | null;
}

export interface BookingRequest {
  userId: string;
  seatIds: string[];
  name: string;
}

const API_BASE = '/api';

export const api = {
  // Get all seats
  getSeats: async (): Promise<Seat[]> => {
    const response = await fetch(`${API_BASE}/seats`);
    const data = await response.json();
    return data.seats;
  },

  // Reserve a seat
  reserveSeat: async (seatId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    const formData = new URLSearchParams();
    formData.append('seat_id', seatId);
    formData.append('user_id', userId);

    const response = await fetch(`${API_BASE}/seats/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return response.json();
  },

  // Release a seat
  releaseSeat: async (seatId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    const formData = new URLSearchParams();
    formData.append('seat_id', seatId);
    formData.append('user_id', userId);

    const response = await fetch(`${API_BASE}/seats/release`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return response.json();
  },

  // Book seats (finalize)
  bookSeats: async (data: BookingRequest): Promise<{ success: boolean; message: string }> => {
    const formData = new URLSearchParams();
    formData.append('user_id', data.userId);
    formData.append('seat_ids', data.seatIds.join(','));
    formData.append('name', data.name);

    const response = await fetch(`${API_BASE}/seats/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return response.json();
  },
};
