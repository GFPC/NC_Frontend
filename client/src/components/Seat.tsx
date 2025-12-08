"use client"

import { cn } from "@/lib/utils"
import type { Seat as SeatType } from "@/lib/api"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Loader2, Armchair } from "lucide-react"
import { useState } from "react"

interface SeatProps {
  seat: SeatType
  isSelected: boolean
  isPurchased: boolean // Новый проп - куплено мной
  isHeldByOthers: boolean // Удерживается другими (held)
  isOccupiedByOthers: boolean // Куплено другими (occupied)
  onSelect: (seat: SeatType) => void
  checkingSeatId: string | null
  userId: string
  isVIP: boolean
}

export function Seat({
                       seat,
                       isSelected,
                       isPurchased,
                       isHeldByOthers,
                       isOccupiedByOthers,
                       onSelect,
                       checkingSeatId,
                       userId,
                       isVIP
                     }: SeatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isChecking = checkingSeatId === seat.id

  // Определяем состояние места
  const getSeatStatus = () => {
    if (isPurchased) return "purchased"
    if (isSelected) return "selected"
    if (isOccupiedByOthers) return "occupied"
    if (isHeldByOthers) return "held"
    return "available"
  }

  const seatStatus = getSeatStatus()

  // Цвета для разных состояний
  const statusColor = {
    available: isVIP ? "text-purple-400 hover:text-purple-300" : "text-slate-400 hover:text-slate-200",
    held: "text-red-400", // Места, удерживаемые другими (красный)
    occupied: "text-emerald-400", // Купленные другими
    selected: "text-yellow-300", // Мои выбранные места
    purchased: "text-emerald-300", // Места, купленные мной
  }

  const bgStatus = {
    available: isVIP
        ? "bg-purple-900/20 hover:bg-purple-800/40 border-purple-700/30"
        : "bg-slate-800/40 hover:bg-slate-700/60 border-slate-700/30",
    held: "bg-red-900/30 border border-red-700/50", // Красный для удерживаемых другими
    occupied: "bg-emerald-900/30 border border-emerald-700/50",
    selected: "bg-yellow-500/30 border border-yellow-400/50 animate-pulse",
    purchased: "bg-emerald-900/40 border border-emerald-600/50", // Зеленый для купленных мной
  }

  const handleClick = () => {
    // Открываем попап только для доступных мест
    if (seatStatus === "available") {
      setIsOpen(true)
    }
  }

  const handleAddToCart = () => {
    onSelect(seat)
    setIsOpen(false)
  }

  // Разрешаем клик только для доступных мест
  const isClickable = seatStatus === "available"

  return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              onClick={handleClick}
              className={cn(
                  "relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center transition-all duration-300 border",
                  statusColor[seatStatus],
                  bgStatus[seatStatus],
                  isClickable && "cursor-pointer",
                  !isClickable && "cursor-default",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              )}
              disabled={!isClickable}
              data-testid={`seat-${seat.id}`}
          >
            {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Armchair className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            )}

            <span className="absolute -bottom-4 text-[9px] text-muted-foreground/50 font-mono">
            {seat.row}-{seat.col}
          </span>
          </motion.button>
        </PopoverTrigger>

        <PopoverContent className="w-48 bg-card/95 backdrop-blur border-primary/20 p-3 shadow-xl shadow-primary/10">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-lg leading-none">
              Row {seat.row} <span className="text-muted-foreground text-xs font-sans font-normal">Seat {seat.col}</span>
            </h4>

            {seatStatus === "occupied" ? (
                <div className="bg-emerald-950/50 border border-emerald-900/50 rounded p-2 text-xs text-emerald-200">
                  Purchased by <span className="font-bold">{seat.occupied_by || "Another User"}</span>
                </div>
            ) : seatStatus === "held" ? (
                <div className="bg-red-950/50 border border-red-900/50 rounded p-2 text-xs text-red-200">
                  Temporarily held by another user
                </div>
            ) : seatStatus === "purchased" ? (
                <div className="bg-emerald-950/50 border border-emerald-900/50 rounded p-2 text-xs text-emerald-200">
                  Purchased by <span className="font-bold">You</span>
                </div>
            ) : (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground capitalize">{seat.type}</span>
                    <span className="font-bold text-primary">${seat.price}</span>
                  </div>
                  <Button
                      size="sm"
                      className="w-full mt-2 font-bold tracking-wide"
                      onClick={handleAddToCart}
                      disabled={isChecking}
                      data-testid={`button-add-seat-${seat.id}`}
                  >
                    ADD TO CART
                  </Button>
                </>
            )}
          </div>
        </PopoverContent>
      </Popover>
  )
}