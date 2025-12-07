import { useState, useEffect } from 'react';

// Types
export interface Seat {
  id: string;
  row: number;
  col: number;
  price: number;
  status: 'available' | 'occupied';
  type: 'standard' | 'vip';
  occupiedBy?: string | null; // Name of the user who took it
  heldBy?: string | null; // User ID holding it in cart
}

export interface BookingRequest {
  userId: string;
  seatIds: string[];
  name: string;
}

// Constants
const ROWS = 8;
const COLS = 10;
const PRICE_STANDARD = 12;
const PRICE_VIP = 18;

// Initial Data Generator
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      const isVip = r === ROWS || r === ROWS - 1; // Last 2 rows are VIP
      seats.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        price: isVip ? PRICE_VIP : PRICE_STANDARD,
        status: 'available', // ALL FREE INITIALLY
        type: isVip ? 'vip' : 'standard',
        occupiedBy: null,
        heldBy: null
      });
    }
  }
  return seats;
};

// Mock Server State (In-Memory)
let serverSeats = generateSeats();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Methods
export const api = {
  // Get all seats
  getSeats: async (): Promise<Seat[]> => {
    await delay(300); 
    return [...serverSeats];
  },

  // Reserve a seat (Add to cart)
  reserveSeat: async (seatId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    await delay(200);
    const seatIndex = serverSeats.findIndex(s => s.id === seatId);
    
    if (seatIndex === -1) return { success: false, message: 'Seat not found' };
    
    const seat = serverSeats[seatIndex];

    // Check if already taken or held by someone else
    if (seat.status === 'occupied' || (seat.heldBy && seat.heldBy !== userId)) {
      return { success: false, message: 'Seat is already taken' };
    }

    // Lock the seat
    serverSeats[seatIndex] = {
      ...seat,
      status: 'occupied', // Visually occupied for others
      heldBy: userId,
      occupiedBy: null // Not fully booked yet, just held
    };

    return { success: true, message: 'Seat reserved' };
  },

  // Release a seat (Remove from cart)
  releaseSeat: async (seatId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    await delay(200);
    const seatIndex = serverSeats.findIndex(s => s.id === seatId);
    
    if (seatIndex === -1) return { success: false, message: 'Seat not found' };
    
    const seat = serverSeats[seatIndex];

    // Only release if held by this user
    if (seat.heldBy === userId) {
       serverSeats[seatIndex] = {
        ...seat,
        status: 'available',
        heldBy: null,
        occupiedBy: null
      };
    }

    return { success: true, message: 'Seat released' };
  },

  // Check specific seat availability (legacy check, still useful)
  checkAvailability: async (seatId: string): Promise<boolean> => {
    await delay(200);
    const seat = serverSeats.find(s => s.id === seatId);
    return seat ? seat.status === 'available' : false;
  },

  // Book seats (Finalize)
  bookSeats: async (data: BookingRequest): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    
    // Verify user holds these seats
    const userSeats = serverSeats.filter(s => data.seatIds.includes(s.id));
    const allHeldByUser = userSeats.every(s => s.heldBy === data.userId);

    if (!allHeldByUser) {
      return { success: false, message: 'Reservation expired or invalid.' };
    }

    // Finalize booking
    serverSeats = serverSeats.map(s => 
      data.seatIds.includes(s.id) ? { 
        ...s, 
        status: 'occupied', 
        heldBy: null, // Clear hold
        occupiedBy: data.name // Assign real name
      } : s
    );

    return { success: true, message: 'Booking successful!' };
  }
};
