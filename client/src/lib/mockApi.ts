import { useState, useEffect } from 'react';

// Types
export interface Seat {
  id: string;
  row: number;
  col: number;
  price: number;
  status: 'available' | 'occupied';
  type: 'standard' | 'vip';
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
        status: Math.random() > 0.8 ? 'occupied' : 'available', // Random initial occupancy
        type: isVip ? 'vip' : 'standard',
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
    await delay(300); // Simulate network latency
    // Randomly occupy a new seat occasionally to simulate live updates
    if (Math.random() > 0.9) {
       const availableSeats = serverSeats.filter(s => s.status === 'available');
       if (availableSeats.length > 0) {
         const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
         randomSeat.status = 'occupied';
       }
    }
    return [...serverSeats];
  },

  // Check specific seat availability
  checkAvailability: async (seatId: string): Promise<boolean> => {
    await delay(200);
    const seat = serverSeats.find(s => s.id === seatId);
    return seat ? seat.status === 'available' : false;
  },

  // Book seats
  bookSeats: async (data: BookingRequest): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    
    // Verify all seats are still available
    const requestedSeats = serverSeats.filter(s => data.seatIds.includes(s.id));
    const allAvailable = requestedSeats.every(s => s.status === 'available');

    if (!allAvailable) {
      return { success: false, message: 'Some selected seats were just taken. Please refresh.' };
    }

    // Mark as occupied
    serverSeats = serverSeats.map(s => 
      data.seatIds.includes(s.id) ? { ...s, status: 'occupied' } : s
    );

    return { success: true, message: 'Booking successful!' };
  }
};
