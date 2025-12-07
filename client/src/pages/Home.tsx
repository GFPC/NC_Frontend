import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Seat as SeatType } from "@/lib/mockApi";
import { CinemaHall } from "@/components/CinemaHall";
import { Cart } from "@/components/Cart";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

// Simple ID generator since we can't install new packages mid-stream easily if not essential
const generateId = () => Math.random().toString(36).substring(2, 15);

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [checkingSeatId, setCheckingSeatId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Initialize User ID
  useEffect(() => {
    let storedId = localStorage.getItem('cinema_user_id');
    if (!storedId) {
      storedId = generateId();
      localStorage.setItem('cinema_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  // Fetch Seats (Poll every 5 seconds)
  const { data: seats = [], isLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: api.getSeats,
    refetchInterval: 5000,
  });

  // Booking Mutation
  const bookMutation = useMutation({
    mutationFn: api.bookSeats,
    onSuccess: (data) => {
      if (data.success) {
        // Success Effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#db2777', '#00f0ff']
        });

        toast({
          title: "Booking Successful!",
          description: "Your tickets have been reserved.",
          variant: "default",
          className: "bg-green-900 border-green-800 text-white"
        });
        
        setSelectedSeatIds([]);
        setIsCheckoutOpen(false);
        queryClient.invalidateQueries({ queryKey: ['seats'] });
      } else {
        toast({
          title: "Booking Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handlers
  const handleToggleSeat = async (seat: SeatType) => {
    // If already selected, remove it
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
      return;
    }

    // Check availability before adding
    setCheckingSeatId(seat.id);
    try {
      const isAvailable = await api.checkAvailability(seat.id);
      if (isAvailable) {
        setSelectedSeatIds(prev => [...prev, seat.id]);
      } else {
        toast({
          title: "Seat Unavailable",
          description: "This seat was just taken by someone else.",
          variant: "destructive",
        });
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ['seats'] });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not verify seat availability.",
        variant: "destructive",
      });
    } finally {
      setCheckingSeatId(null);
    }
  };

  const handleCheckout = (name: string) => {
    bookMutation.mutate({
      userId,
      seatIds: selectedSeatIds,
      name
    });
  };

  const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));

  return (
    <div className="min-h-screen bg-background pb-32 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-display font-bold text-white shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              N
            </div>
            <h1 className="font-display font-bold text-xl tracking-wider text-white">
              NEON <span className="text-primary">CINEMA</span>
            </h1>
          </div>
          <div className="text-xs text-muted-foreground font-mono hidden sm:block">
            ID: {userId}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">
            Select Your Seats
          </h2>
          <p className="text-muted-foreground">
            Tap on available seats to add them to your cart.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <CinemaHall 
            seats={seats} 
            selectedSeats={selectedSeatIds} 
            onToggleSeat={handleToggleSeat}
            checkingSeatId={checkingSeatId}
          />
        )}
      </main>

      {/* Cart & Checkout */}
      <Cart 
        selectedSeats={selectedSeats}
        onRemove={(id) => setSelectedSeatIds(prev => prev.filter(s => s !== id))}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutDialog 
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onSubmit={handleCheckout}
        isProcessing={bookMutation.isPending}
        totalAmount={selectedSeats.reduce((sum, s) => sum + s.price, 0)}
      />
    </div>
  );
}
