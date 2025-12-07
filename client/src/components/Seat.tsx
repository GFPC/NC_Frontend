import { cn } from "@/lib/utils";
import { Seat as SeatType } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Armchair } from "lucide-react";
import { useState } from "react";

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  isHeldByOthers: boolean;
  onSelect: (seat: SeatType) => void;
  isChecking: boolean;
}

export function Seat({ seat, isSelected, isHeldByOthers, onSelect, isChecking }: SeatProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Status Colors
  const statusColor = {
    available: seat.type === 'vip' ? 'text-purple-400 hover:text-purple-300' : 'text-slate-400 hover:text-slate-200',
    occupied: 'text-red-900',
    selected: 'text-primary animate-pulse',
  };

  const bgStatus = {
    available: seat.type === 'vip' ? 'bg-purple-900/20 hover:bg-purple-800/40' : 'bg-slate-800/40 hover:bg-slate-700/60',
    occupied: 'bg-red-950/30',
    selected: 'bg-primary/20 border-primary/50',
  };

  const handleClick = () => {
    if (isSelected) {
      onSelect(seat);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleAddToCart = () => {
    onSelect(seat);
    setIsOpen(false);
  };

  const isOccupied = seat.status === 'occupied' && !isSelected;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={!isOccupied ? { scale: 1.1 } : {}}
          whileTap={!isOccupied ? { scale: 0.95 } : {}}
          onClick={handleClick}
          className={cn(
            "relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center transition-all duration-300 border border-transparent",
            isSelected ? statusColor.selected : isOccupied ? statusColor.occupied : statusColor.available,
            isSelected ? bgStatus.selected : isOccupied ? bgStatus.occupied : bgStatus.available,
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
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
      
      <PopoverContent className="w-48 bg-card/95 backdrop-blur border-primary/20 p-3 shadow-xl shadow-primary/10">
        <div className="space-y-2">
          <h4 className="font-display font-bold text-lg leading-none">
            Row {seat.row} <span className="text-muted-foreground text-xs font-sans font-normal">Seat {seat.col}</span>
          </h4>
          
          {isOccupied ? (
             <div className="bg-red-950/50 border border-red-900/50 rounded p-2 text-xs text-red-200">
               Taken by <span className="font-bold">{seat.occupied_by || 'Another User'}</span>
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
  );
}
