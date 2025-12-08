import { motion, AnimatePresence } from "framer-motion";
import { Seat as SeatType } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";

interface CartProps {
  selectedSeats: SeatType[];
  onRemove: (seatId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export function Cart({ selectedSeats, onRemove, onCheckout, isCheckingOut }: CartProps) {
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (selectedSeats.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-primary/20 p-4 sm:p-6 pb-8 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <h3 className="text-sm font-display uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Your Cart
          </h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedSeats.map(seat => (
                <motion.div
                  key={seat.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-secondary/50 border border-white/5 rounded-full px-3 py-1 flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-primary">R{seat.row}:C{seat.col}</span>
                  <span className="text-xs text-white">${seat.price}</span>
                  <button
                    onClick={() => onRemove(seat.id)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0 mt-2 sm:mt-0">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-2xl font-display font-bold text-white text-shadow-neon">
              ${total}
            </div>
          </div>
          <Button
              size="lg"
              onClick={onCheckout}
              disabled={isCheckingOut} // Отключаем кнопку во время загрузки
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider px-8 shadow-[0_0_20px_-5px_hsl(var(--primary))] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
            ) : (
                "CHECKOUT"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
