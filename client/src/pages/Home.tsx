import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Seat as SeatType } from "@/lib/api";
import { CinemaHall } from "@/components/CinemaHall";
import { Cart } from "@/components/Cart";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [checkingSeatId, setCheckingSeatId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let storedId = localStorage.getItem('cinema_user_id');
    if (!storedId) {
      storedId = generateId();
      localStorage.setItem('cinema_user_id', storedId);
    }
    setUserId(storedId);
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const { data: seats = [], isLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: api.getSeats,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const mySelectedSeats = seats.filter(s => s.held_by === userId);
  const mySelectedSeatIds = mySelectedSeats.map(s => s.id);

  const reserveMutation = useMutation({
    mutationFn: (seatId: string) => api.reserveSeat(seatId, userId),
    onSuccess: (data) => {
      if (!data.success) {
        toast({
          title: "Unavailable",
          description: data.message,
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
    onError: () => {
       toast({ title: "Error", description: "Failed to reserve seat", variant: "destructive" });
    },
    onSettled: () => setCheckingSeatId(null)
  });

  const releaseMutation = useMutation({
    mutationFn: (seatId: string) => api.releaseSeat(seatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
    onSettled: () => setCheckingSeatId(null)
  });

  const bookMutation = useMutation({
    mutationFn: api.bookSeats,
    onSuccess: (data) => {
      if (data.success) {
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
        
        setIsCheckoutOpen(false);
        queryClient.invalidateQueries({ queryKey: ['seats'] });
      } else {
        toast({
          title: "Booking Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    }
  });

  const handleToggleSeat = async (seat: SeatType) => {
    if (seat.held_by === userId) {
      setCheckingSeatId(seat.id);
      releaseMutation.mutate(seat.id);
      return;
    }

    if (seat.status === 'occupied') return;

    setCheckingSeatId(seat.id);
    reserveMutation.mutate(seat.id);
  };

  const handleCheckout = (name: string) => {
    bookMutation.mutate({
      userId,
      seatIds: mySelectedSeatIds,
      name
    });
  };

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
    
    {/* Стилизованная надпись */}
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
        <span className="text-xs text-muted-foreground font-mono tracking-wider">
          by <span className="text-primary/80">Greg Feov</span>
        </span>
      </div>
    </div>
    
    <div className="text-xs text-muted-foreground font-mono hidden sm:block">
      ID: {userId}
    </div>
  </div>
</header>

      <main className="flex-1 relative bg-black/50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
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
    </div>
  );
}
