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
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden touch-none relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[10px] text-muted-foreground/50 uppercase tracking-widest pointer-events-none">
        Pinch to Zoom • Drag to Pan
      </div>

      <TransformWrapper initialScale={1} minScale={0.5} maxScale={3} centerOnInit limitToBounds={false}>
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

            <div className="grid gap-y-6 sm:gap-y-8 gap-x-2 sm:gap-x-3 md:gap-x-4 justify-center">
              {Array.from(new Set(seats.map((s) => s.row)))
                .sort((a, b) => a - b)
                .map((row) => (
                  <div key={row} className="flex gap-2 sm:gap-3 justify-center">
                    <div className="flex items-center justify-center w-5 sm:w-6 text-xs text-muted-foreground/30 font-mono absolute left-2 sm:left-4 md:static">
                      {row}
                    </div>

                    {seats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.col - b.col)
                      .map((seat) => {
                        const isHeldByMe = seat.held_by === userId
                        const isHeldByOthers = seat.status === "occupied" && !isHeldByMe
                        const isVIP = seat.type === "VIP"

                        return (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isSelected={isHeldByMe}
                            isHeldByOthers={isHeldByOthers}
                            onSelect={onToggleSeat}
                            isChecking={checkingSeatId === seat.id}
                            isVIP={isVIP}
                          />
                        )
                      })}

                    <div className="flex items-center justify-center w-5 sm:w-6 text-xs text-muted-foreground/30 font-mono absolute right-2 sm:right-4 md:static">
                      {row}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center mt-12 sm:mt-16 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-800/40 border border-slate-700"></div>
                <span>Available Regular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-900/30 border border-purple-700"></div>
                <span>Available VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-400/50 animate-pulse"></div>
                <span>My Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-900/30 border border-emerald-700/50"></div>
                <span>Purchased</span>
              </div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
