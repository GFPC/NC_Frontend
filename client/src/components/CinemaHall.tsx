import { Seat } from "./Seat";
import { Seat as SeatType } from "@/lib/mockApi";
import { motion } from "framer-motion";

interface CinemaHallProps {
  seats: SeatType[];
  selectedSeats: string[];
  onToggleSeat: (seat: SeatType) => void;
  checkingSeatId: string | null;
}

export function CinemaHall({ seats, selectedSeats, onToggleSeat, checkingSeatId }: CinemaHallProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 perspective-[1000px]">
      {/* Screen */}
      <div className="relative mb-12 sm:mb-20">
        <div className="h-16 w-full bg-gradient-to-b from-primary/20 to-transparent rounded-t-[50%] transform rotate-x-12 scale-x-90 screen-glow border-t border-primary/30" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-primary/40 text-sm tracking-[1em] font-display uppercase">
          Screen
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid gap-y-8 gap-x-2 sm:gap-x-4 justify-center">
        {Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b).map(row => (
          <div key={row} className="flex gap-2 sm:gap-3 justify-center">
            {/* Row Label */}
            <div className="flex items-center justify-center w-6 text-xs text-muted-foreground/30 font-mono absolute left-4 sm:static">
              {row}
            </div>
            
            {seats
              .filter(s => s.row === row)
              .sort((a, b) => a.col - b.col)
              .map(seat => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.id)}
                  onSelect={onToggleSeat}
                  isChecking={checkingSeatId === seat.id}
                />
              ))}
              
            {/* Row Label Right */}
            <div className="flex items-center justify-center w-6 text-xs text-muted-foreground/30 font-mono absolute right-4 sm:static">
              {row}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-16 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-800/40 border border-slate-700"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50 animate-pulse"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-950/30 border border-transparent"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
}
