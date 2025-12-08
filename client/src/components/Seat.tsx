"use client"

import { cn } from "@/lib/utils"
import type { Seat as SeatType } from "@/lib/api"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Loader2, Armchair } from "lucide-react"
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
  const statusText = seat.status === "occupied" ? "Purchased by" : "Reserved by"

  const statusColor = {
    available: isVIP ? "text-purple-400 hover:text-purple-300" : "text-slate-400 hover:text-slate-200",
    occupied: "text-red-400 hover:text-red-300", // Добавил hover
    selected: "text-yellow-300 animate-pulse",
  }

  const bgStatus = {
    available: isVIP ? "bg-purple-900/20 hover:bg-purple-800/40" : "bg-slate-800/40 hover:bg-slate-700/60",
    occupied: "bg-red-900/30 hover:bg-red-800/40 border border-red-700/50", // Добавил hover
    selected: "bg-yellow-500/30 border border-yellow-400/50",
  }

  const handleClick = () => {
    if (isOccupiedByOthers) {
      // Для занятых мест просто открываем popover с информацией
      setIsOpen(true)
      return
    }
    
    if (isSelected) {
      onSelect(seat)
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  const handleAddToCart = () => {
    if (isOccupiedByOthers) {
      return
    }
    onSelect(seat)
    setIsOpen(false)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Popover 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <PopoverTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={cn(
              "relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center transition-all duration-300 border",
              "cursor-pointer",
              isSelected ? statusColor.selected : isOccupiedByOthers ? statusColor.occupied : statusColor.available,
              isSelected ? bgStatus.selected : isOccupiedByOthers ? bgStatus.occupied : bgStatus.available,
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
            )}
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

        <PopoverContent 
          className="w-48 bg-card/95 backdrop-blur border-primary/20 p-3 shadow-xl shadow-primary/10"
          side="top"
          align="center"
          sideOffset={5}
        >
          <div className="space-y-2">
            <h4 className="font-display font-bold text-lg leading-none">
              Row {seat.row} <span className="text-muted-foreground text-xs font-sans font-normal">Seat {seat.col}</span>
            </h4>

            {isOccupiedByOthers ? (
              <div className="space-y-2">
                <div className="bg-red-950/50 border border-red-900/50 rounded p-2 text-xs text-red-200">
                  <div className="font-bold text-red-300 mb-1">
                    {seat.status === "occupied" ? "PURCHASED" : "RESERVED"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-800/50 flex items-center justify-center text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{userName}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {seat.status === "occupied" 
                    ? "This seat has been purchased and is no longer available."
                    : "This seat is currently reserved. Try again later if reservation expires."}
                </div>
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

        {/* Tooltip для быстрого просмотра при наведении */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0" />
          </TooltipTrigger>
          {isOccupiedByOthers && (
            <TooltipContent 
              className="bg-red-950 border-red-800 text-red-100"
              side="top"
              align="center"
            >
              <p className="font-medium">{statusText} {userName}</p>
              <p className="text-xs text-red-300">Click for details</p>
            </TooltipContent>
          )}
        </Tooltip>
      </Popover>
    </TooltipProvider>
  )
}
