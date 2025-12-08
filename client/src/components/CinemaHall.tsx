"use client"

import { Seat } from "./Seat"
import type { Seat as SeatType } from "@/lib/api"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface CinemaHallProps {
  seats: SeatType[]
  selectedSeats: string[]
  onToggleSeat: (seat: SeatType) => void
  checkingSeatId: string | null
  userId: string
}

export function CinemaHall({ seats, selectedSeats, onToggleSeat, checkingSeatId, userId }: CinemaHallProps) {
  // Группируем места по рядам
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b)
  const seatsByRow = rows.reduce((acc, row) => {
    acc[row] = seats
        .filter((s) => s.row === row)
        .sort((a, b) => a.col - b.col)
    return acc
  }, {} as Record<number, SeatType[]>)

  return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden touch-none relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[10px] text-muted-foreground/100 uppercase tracking-widest pointer-events-none">
          Pinch to Zoom • Drag to Pan
        </div>

        <TransformWrapper initialScale={0.75} minScale={0.5} maxScale={3} centerOnInit limitToBounds={false}>
          <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
          >
            <div className="p-4 sm:p-8 md:p-16 min-w-[280px] sm:min-w-[350px] md:min-w-[600px]">
              <div className="relative mb-8 sm:mb-12 md:mb-20">
                <div className="h-16 w-full bg-gradient-to-b from-primary/20 to-transparent rounded-t-[50%] transform rotate-x-12 scale-x-90 screen-glow border-t border-primary/30" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-primary/40 text-sm tracking-[1em] font-display uppercase">
                  Screen
                </div>
              </div>

              {/* Сетка мест без номеров рядов */}
              <div className="grid gap-y-4 sm:gap-y-6 md:gap-y-8 justify-center">
                {rows.map((row) => (
                    <div key={row} className="flex gap-1 sm:gap-2 md:gap-3 justify-center">
                      {seatsByRow[row].map((seat) => {
                        // Простая логика определения состояния
                        //console.log(seat)
                        const isInMyCart = seat.held_by === userId || seat.held_by?.includes(userId)
                        const isBookedByMe = seat.occupied_by === userId || seat.occupied_by?.includes(userId)

                        const isPurchased = seat.status === "occupied" &&seat.occupied_by !== userId && !seat.occupied_by?.includes(userId)
                        const isHeld = seat.status === "occupied" &&seat.held_by !== userId && !seat.held_by?.includes(userId) && !seat.occupied_by

                        //console.log(isInMyCart, isBookedByMe, isPurchased, isHeld)

                        return (
                            <Seat
                                key={seat.id}
                                seat={seat}
                                isInMyCart={isInMyCart || false}
                                isBookedByMe={isBookedByMe || false}
                                isPurchased={isPurchased}
                                isHeld={isHeld}
                                onSelect={onToggleSeat}
                                checkingSeatId={checkingSeatId}
                                isVIP={seat.type === "VIP" || seat.type === "vip"}
                            />
                        )
                      })}
                    </div>
                ))}
              </div>

              {/* Легенда */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mt-8 sm:mt-12 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800/40 border border-slate-700"></div>
                  <span>Regular Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-900/30 border border-purple-700"></div>
                  <span>VIP Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-400 animate-pulse"></div>
                  <span>My selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-900/30 border border-red-700"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-900/30 border border-emerald-700"></div>
                  <span>Purchased by me</span>
                </div>
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
  )
}