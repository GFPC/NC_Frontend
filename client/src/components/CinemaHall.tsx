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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[10px] text-muted-foreground/70 uppercase tracking-widest pointer-events-none bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
        ✨ Pinch to Zoom • Drag to Pan
      </div>

      <TransformWrapper initialScale={0.75} minScale={0.5} maxScale={3} centerOnInit limitToBounds={false}>
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full flex items-center justify-center"
        >
          <div className="p-4 sm:p-8 md:p-16 min-w-[280px] sm:min-w-[350px] md:min-w-[600px]">
            <div className="relative mb-10 sm:mb-14 md:mb-24">
              <div className="h-16 w-full bg-gradient-to-b from-primary/30 via-primary/20 to-transparent rounded-t-[50%] transform rotate-x-12 scale-x-90 screen-glow border-t border-primary/40 shadow-lg shadow-primary/10" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-primary/80 text-lg font-bold tracking-[0.5em] font-display uppercase bg-gradient-to-r from-primary/20 to-primary/10 px-6 py-2 rounded-full backdrop-blur-sm border border-primary/20">
                SCREEN
              </div>
            </div>

            <div className="grid gap-y-6 sm:gap-y-8 gap-x-2 sm:gap-x-3 md:gap-x-4 justify-center">
              {Array.from(new Set(seats.map((s) => s.row)))
                .sort((a, b) => a - b)
                .map((row) => (
                  <div key={row} className="flex gap-2 sm:gap-3 justify-center relative">
                    {/* Левая нумерация рядов */}
                    <div className="flex items-center justify-center w-6 sm:w-7 md:w-8 text-sm font-bold text-foreground/90 bg-secondary/50 backdrop-blur-sm rounded-full h-8 sm:h-9 md:h-10 shadow-sm absolute left-1 sm:left-2 md:static z-10 border border-border/50">
                      {String.fromCharCode(64 + row)} {/* A, B, C... */}
                    </div>

                    {/* Места в ряду */}
                    {seats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.col - b.col)
                      .map((seat) => {
                        const isHeldByMe = seat.held_by === userId
                        const isHeldByOthers = (seat.status === "occupied" || seat.status === "held") && !isHeldByMe
                        const isVIP = seat.type === "VIP"

                        return (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            isSelected={isHeldByMe}
                            isHeldByOthers={isHeldByOthers}
                            onSelect={onToggleSeat}
                            isChecking={checkingSeatId === seat.id}
                            userId={userId}
                            isVIP={isVIP}
                          />
                        )
                      })}

                    {/* Правая нумерация рядов */}
                    <div className="flex items-center justify-center w-6 sm:w-7 md:w-8 text-sm font-bold text-foreground/90 bg-secondary/50 backdrop-blur-sm rounded-full h-8 sm:h-9 md:h-10 shadow-sm absolute right-1 sm:right-2 md:static z-10 border border-border/50">
                      {String.fromCharCode(64 + row)} {/* A, B, C... */}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center mt-14 sm:mt-20 text-sm sm:text-base">
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-border/50 shadow-sm">
                <div className="w-5 h-5 rounded bg-slate-800/70 border-2 border-slate-600 shadow-sm"></div>
                <span className="text-foreground/95 font-medium">Regular</span>
              </div>
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-border/50 shadow-sm">
                <div className="w-5 h-5 rounded bg-purple-900/50 border-2 border-purple-500 shadow-sm"></div>
                <span className="text-foreground/95 font-medium">VIP</span>
              </div>
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-border/50 shadow-sm">
                <div className="w-5 h-5 rounded bg-yellow-500/50 border-2 border-yellow-400 shadow-sm animate-pulse"></div>
                <span className="text-foreground/95 font-medium">My Seats</span>
              </div>
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-border/50 shadow-sm">
                <div className="w-5 h-5 rounded bg-red-900/50 border-2 border-red-500 shadow-sm"></div>
                <span className="text-foreground/95 font-medium">Occupied</span>
              </div>
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-border/50 shadow-sm">
                <div className="w-5 h-5 rounded bg-emerald-900/50 border-2 border-emerald-500 shadow-sm"></div>
                <span className="text-foreground/95 font-medium">Purchased</span>
              </div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
