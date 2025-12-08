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
    isInMyCart: boolean // Удерживается мной (в корзине)
    isBookedByMe: boolean // Куплено мей
    isPurchased: boolean // Куплено (любым пользователем)
    isHeld: boolean // Удерживается (любым пользователем)
    onSelect: (seat: SeatType) => void
    checkingSeatId: string | null
    isVIP: boolean
}

export function Seat({
                         seat,
                         isInMyCart,
                         isBookedByMe,
                         isPurchased,
                         isHeld,
                         onSelect,
                         checkingSeatId,
                         isVIP
                     }: SeatProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isChecking = checkingSeatId === seat.id

    // Определяем состояние места
    const getSeatState = () => {
        if (isBookedByMe) return "purchased-by-me" // Куплено мной - зеленый
        if (isInMyCart) return "my-selection" // В моей корзине - желтый
        if (isPurchased || isHeld) return "unavailable" // Куплено/забронировано другими - красный
        return isVIP ? "available-vip" : "available" // Доступно
    }

    const seatState = getSeatState()

    // Стили для каждого состояния
    const getStyles = () => {
        switch (seatState) {
            case "purchased-by-me":
                return {
                    text: "text-emerald-300",
                    bg: "bg-emerald-900/40 border-emerald-700",
                    cursor: "cursor-default"
                }
            case "my-selection":
                return {
                    text: "text-yellow-300",
                    bg: "bg-yellow-500/30 border-yellow-400 animate-pulse",
                    cursor: "cursor-pointer hover:bg-yellow-500/40"
                }
            case "unavailable":
                return {
                    text: "text-red-300",
                    bg: "bg-red-900/30 border-red-700",
                    cursor: "cursor-default"
                }
            case "available-vip":
                return {
                    text: "text-purple-300 hover:text-purple-200",
                    bg: "bg-purple-900/20 border-purple-700 hover:bg-purple-800/30",
                    cursor: "cursor-pointer"
                }
            default: // available
                return {
                    text: "text-slate-300 hover:text-slate-100",
                    bg: "bg-slate-800/40 border-slate-700 hover:bg-slate-700/50",
                    cursor: "cursor-pointer"
                }
        }
    }

    const styles = getStyles()
    const isAvailable = seatState === "available" || seatState === "available-vip" || seatState === "my-selection"

    const handleClick = () => {
        if (!isAvailable) return
        if (seatState === "my-selection") {
            // Если место уже у меня в корзине, сразу убираем
            onSelect(seat)
            setIsOpen(false)
        } else {
            // Если доступно, открываем попап
            setIsOpen(true)
        }
    }

    const handleAddToCart = () => {
        onSelect(seat)
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <motion.button
                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    onClick={handleClick}
                    className={cn(
                        "relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center transition-all duration-200 border",
                        styles.text,
                        styles.bg,
                        styles.cursor,
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    )}
                    disabled={!isAvailable}
                    data-testid={`seat-${seat.id}`}
                >
                    {isChecking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Armchair className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    )}

                    {/* Номер места (ряд-колонка) */}
                    <span className="absolute -bottom-4 text-[9px] text-muted-foreground/60 font-mono">
            {seat.row}-{seat.col}
          </span>
                </motion.button>
            </PopoverTrigger>

            <PopoverContent className="w-48 bg-card/95 backdrop-blur border-primary/20 p-3 shadow-xl shadow-primary/10">
                <div className="space-y-2">
                    <h4 className="font-display font-bold text-lg leading-none">
                        Row {seat.row} <span className="text-muted-foreground text-xs font-sans font-normal">Seat {seat.col}</span>
                    </h4>

                    {seatState === "unavailable" ? (
                        <div className="bg-red-950/50 border border-red-900/50 rounded p-2 text-xs text-red-200">
                            {isPurchased ? `Purchased by ${seat.name ? seat.name : "Someone"}` : `Temporarily reserved by ${seat.name ? seat.name : "Someone"}`}
                        </div>
                    ) : seatState === "purchased-by-me" ? (
                        <div className="bg-emerald-950/50 border border-emerald-900/50 rounded p-2 text-xs text-emerald-200">
                            Purchased by <span className="font-bold">You</span>
                        </div>
                    ) : seatState === "my-selection" ? (
                        <>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground capitalize">{seat.type}</span>
                                <span className="font-bold text-primary">${seat.price}</span>
                            </div>
                            <div className="bg-yellow-950/30 border border-yellow-900/50 rounded p-2 text-xs text-yellow-200 mb-2">
                                In your cart
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="w-full font-bold tracking-wide"
                                onClick={handleAddToCart}
                                disabled={isChecking}
                            >
                                REMOVE FROM CART
                            </Button>
                        </>
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