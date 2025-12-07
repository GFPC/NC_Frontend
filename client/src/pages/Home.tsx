"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type Seat as SeatType } from "@/lib/api"
import { CinemaHall } from "@/components/CinemaHall"
import { Cart } from "@/components/Cart"
import { CheckoutDialog } from "@/components/CheckoutDialog"
import { LoadingScreen } from "@/components/LoadingScreen"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { NameDialog } from "@/components/NameDialog"

const generateId = () => Math.random().toString(36).substring(2, 15)

export default function Home() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [checkingSeatId, setCheckingSeatId] = useState<string | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false) // Track minimum loading time
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false) // Track if name dialog should show

  useEffect(() => {
    let storedId = localStorage.getItem("cinema_user_id")
    if (!storedId) {
      storedId = generateId()
      localStorage.setItem("cinema_user_id", storedId)
    }
    setUserId(storedId)

    const storedName = localStorage.getItem("cinema_user_name")
    if (!storedName) {
      setIsNameDialogOpen(true)
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingTimeElapsed(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const { data: seats = [], isLoading } = useQuery({
    queryKey: ["seats"],
    queryFn: api.getSeats,
    refetchInterval: 5000, // Poll every 5 seconds
  })

  const shouldShowLoading = isLoading || !minLoadingTimeElapsed

  const mySelectedSeats = seats.filter((s) => s.held_by === userId)
  const mySelectedSeatIds = mySelectedSeats.map((s) => s.id)

  const reserveMutation = useMutation({
    mutationFn: (seatId: string) => api.reserveSeat(seatId, userId),
    onSuccess: (data) => {
      if (!data.success) {
        toast({
          title: "Unavailable",
          description: data.message,
          variant: "destructive",
        })
      }
      queryClient.invalidateQueries({ queryKey: ["seats"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reserve seat", variant: "destructive" })
    },
    onSettled: () => setCheckingSeatId(null),
  })

  const releaseMutation = useMutation({
    mutationFn: (seatId: string) => api.releaseSeat(seatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats"] })
    },
    onSettled: () => setCheckingSeatId(null),
  })

  const bookMutation = useMutation({
    mutationFn: api.bookSeats,
    onSuccess: (data) => {
      if (data.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#db2777", "#00f0ff"],
        })

        toast({
          title: "Booking Successful!",
          description: "Your tickets have been reserved.",
          variant: "default",
          className: "bg-green-900 border-green-800 text-white shadow-[0_0_15px_-3px_hsl(var(--primary))]",
        })

        setIsCheckoutOpen(false)
        queryClient.invalidateQueries({ queryKey: ["seats"] })
      } else {
        toast({
          title: "Booking Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    },
  })

  const handleToggleSeat = async (seat: SeatType) => {
    if (seat.held_by === userId) {
      setCheckingSeatId(seat.id)
      releaseMutation.mutate(seat.id)
      return
    }

    if (seat.status === "occupied") return

    setCheckingSeatId(seat.id)
    reserveMutation.mutate(seat.id)
  }

  const handleCheckout = (name: string) => {
    bookMutation.mutate({
      userId,
      seatIds: mySelectedSeatIds,
      name,
    })
  }

  const handleNameSubmit = (name: string) => {
    localStorage.setItem("cinema_user_name", name)
    setIsNameDialogOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden flex flex-col">
      <header className="z-40 bg-background/80 backdrop-blur-md border-b border-white/5 shrink-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-display font-bold text-white shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              N
            </div>
            <h1 className="font-display font-bold text-xl tracking-wider text-white">
              NEON <span className="text-primary">CINEMA</span>
            </h1>
          </div>
          <div className="text-xs text-muted-foreground font-mono hidden sm:block">ID: {userId}</div>
        </div>
      </header>

      <main className="flex-1 relative bg-black/50">
        <AnimatePresence>
          {shouldShowLoading && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <LoadingScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {!shouldShowLoading && (
          <CinemaHall
            seats={seats}
            selectedSeats={mySelectedSeatIds}
            onToggleSeat={handleToggleSeat}
            checkingSeatId={checkingSeatId}
            userId={userId}
          />
        )}
      </main>

      <div className="shrink-0 z-50">
        <Cart
          selectedSeats={mySelectedSeats}
          onRemove={(id) => releaseMutation.mutate(id)}
          onCheckout={() => setIsCheckoutOpen(true)}
        />
      </div>

      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onSubmit={handleCheckout}
        isProcessing={bookMutation.isPending}
        totalAmount={mySelectedSeats.reduce((sum, s) => sum + s.price, 0)}
      />

      <NameDialog open={isNameDialogOpen} onSubmit={handleNameSubmit} />
    </div>
  )
}
