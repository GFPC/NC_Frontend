"use client"

import { cn } from "@/lib/utils"
import type { Seat as SeatType } from "@/lib/api"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Loader2, Armchair, Crown } from "lucide-react"
import { useState } from "react"

interface SeatProps {
  seat: SeatType
  isSelected: boolean
  isHeldByOthers: boolean
  onSelect: (seat: SeatType) => void
  isChecking: boolean
  userId: string
  isVIP?: boolean
}

export function Seat({ seat, isSelected, isHeldByOthers, onSelect, isChecking, userId, isVIP }: SeatProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Если место занято другими (куплено или забронировано не мной)
  const isOccupiedByOthers = (seat.status === "occupied" || seat.status === "held") && seat.held_by !== userId
  const userName = seat.occupied_by || seat.held_by || "Another User"
  const statusText = seat.status === "occupied" ? "Purchased" : "Reserved"

  const statusColor = {
    available: isVIP ? "text-purple-300 hover:text-purple-200" : "text-slate-300 hover:text-slate-100",
    occupied: "text-red-300 hover:text-red-200",
    selected: "text-yellow-200 hover:text-yellow-100 animate-pulse",
  }

  const bgStatus = {
    available: isVIP 
      ? "bg-gradient-to-br from-purple-900/40 to-purple-800/30 hover:from-purple-800/50 hover:to-purple-700/40 border border-purple-600/40 shadow-sm shadow-purple-900/20" 
      : "bg-gradient-to-br from-slate-800/50 to-slate-900/40 hover:from-slate-700/50 hover:to-slate-800/40 border border-slate-600/40 shadow-sm",
    occupied: "bg-gradient-to-br from-red-900/40 to-red-800/30 hover:from-red-800/50 hover:to-red-700/40 border border-red-600/40 shadow-sm shadow-red-900/20",
    selected: "bg-gradient-to-br from-yellow-500/40 to-yellow-600/30 hover:from-yellow-500/50 hover:to-yellow-600/40 border border-yellow-400/60 shadow-lg shadow-yellow-500/20",
  }

  const handleClick = () => {
    if (isOccupiedByOthers) {
      // Для занятых мест показываем popover с информацией
      setIsOpen(true)
    } else {
      // Для свободных и выбранных мест открываем/закрываем popover
      setIsOpen(!isOpen)
    }
  }

  const handleAddToCart = () => {
    onSelect(seat)
    setIsOpen(false)
  }

  const handleRemoveFromCart = () => {
    onSelect(seat)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.15, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={cn(
            "relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-t-xl rounded-b-md flex items-center justify-center transition-all duration-300",
            "cursor-pointer group",
            isSelected ? statusColor.selected : isOccupiedByOthers ? statusColor.occupied : statusColor.available,
            isSelected ? bgStatus.selected : isOccupiedByOthers ? bgStatus.occupied : bgStatus.available,
            "focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 focus:ring-offset-background",
            !isOccupiedByOthers && "hover:shadow-lg hover:shadow-current/10",
          )}
          data-testid={`seat-${seat.id}`}
        >
          {isChecking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Armchair className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={2} />
              {isVIP && !isOccupiedByOthers && !isSelected && (
                <Crown className="absolute -top-2 -right-2 w-4 h-4 text-purple-400" fill="currentColor" />
              )}
            </div>
          )}

          {/* Подпись места */}
          <span className="absolute -bottom-5 text-[10px] sm:text-xs font-bold text-foreground/95 bg-secondary/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-border/50 shadow-sm">
            {String.fromCharCode(64 + seat.row)}-{seat.col}
          </span>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-56 bg-gradient-to-b from-card to-card/95 backdrop-blur-lg border-primary/30 p-4 shadow-2xl shadow-primary/15"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-xl leading-none">
              <span className="text-primary">Row {String.fromCharCode(64 + seat.row)}</span>
              <span className="text-muted-foreground text-sm font-sans font-normal ml-2">Seat {seat.col}</span>
            </h4>
            {isVIP && (
              <div className="flex items-center gap-1 bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-xs font-bold border border-purple-700/30">
                <Crown className="w-3 h-3" />
                <span>VIP</span>
              </div>
            )}
          </div>

          {isOccupiedByOthers ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-red-950/70 to-red-900/50 border border-red-800/50 rounded-lg p-3">
                <div className="font-bold text-red-200 text-sm mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                  {statusText}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white font-bold shadow-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{userName}</div>
                    <div className="text-xs text-red-300">by {userName}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-base bg-background/50 p-3 rounded-lg border border-border/30">
                <div>
                  <div className="text-foreground/90 font-medium capitalize">{seat.type}</div>
                  <div className="text-xs text-muted-foreground">Seat</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-xl">${seat.price}</div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
              </div>
              
              {isSelected ? (
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="font-bold">In Your Cart</span>
                    </div>
                    <p className="text-sm text-yellow-200/80 mt-1">Ready for checkout</p>
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full font-bold tracking-wide text-base py-2.5 border-red-500/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
                    onClick={handleRemoveFromCart}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "REMOVE FROM CART"
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  size="default"
                  className="w-full mt-2 font-bold tracking-wide text-lg py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  onClick={handleAddToCart}
                  disabled={isChecking}
                  data-testid={`button-add-seat-${seat.id}`}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "ADD TO CART"
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
