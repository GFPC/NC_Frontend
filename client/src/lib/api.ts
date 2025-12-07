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

// Use environment variable or default to local proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  getSeats: async (): Promise<Seat[]> => {
    const response = await fetch(`${API_BASE}/seats`);
    if (!response.ok) {
      throw new Error('Failed to fetch seats');
    }
    const data = await response.json();
    return data.seats;
  },

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
