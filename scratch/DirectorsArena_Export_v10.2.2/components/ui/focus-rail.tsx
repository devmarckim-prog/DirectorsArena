"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FocusRail({ items, initialIndex = 0, onSelect }: { items: any[], initialIndex?: number, onSelect?: (id: any) => void }) {
  const [active, setActive] = React.useState(initialIndex);
  const [winWidth, setWinWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  
  const count = items.length;
  const wrap = (min: number, max: number, v: number) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;
  const activeIndex = wrap(0, count, active);
  
  const lastSelectedRef = React.useRef<any>(null);

  React.useEffect(() => { 
    const currentId = items[activeIndex]?.id;
    if(onSelect && currentId !== lastSelectedRef.current) {
      onSelect(currentId);
      lastSelectedRef.current = currentId;
    }
  }, [activeIndex, items, onSelect]);

  React.useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive constants
  const isMobile = winWidth < 768;
  const cardWidth = isMobile ? 220 : 300;
  const cardHeight = isMobile ? 300 : 400;
  const offsetDistance = isMobile ? 240 : 360;

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-transparent select-none perspective-2000">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={items[activeIndex].id} 
            src={items[activeIndex].imageSrc} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.2 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 1 }} 
            className="h-full w-full object-cover blur-[100px] scale-150" 
          />
        </AnimatePresence>
      </div>
      
      <div className="relative z-10 flex items-center justify-center w-full preserve-3d">
        {[-2, -1, 0, 1, 2].map((offset) => {
          const index = wrap(0, count, active + offset);
          const item = items[index];
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);
          
          return (
            <motion.div 
              key={active + offset} 
              onClick={() => offset !== 0 && setActive(active + offset)} 
              className={cn(
                "absolute rounded-[2rem] border border-white/5 bg-neutral-950 overflow-hidden cursor-pointer shadow-2xl", 
                isCenter ? "z-30 border-brand-gold/40 shadow-[0_0_50px_rgba(197,160,89,0.2)]" : "z-10 opacity-20 blur-[1px]"
              )} 
              style={{
                width: cardWidth,
                height: cardHeight,
              }}
              animate={{ 
                x: offset * offsetDistance, 
                z: isCenter ? 100 : -200 * absOffset, 
                rotateY: offset * -35,
                scale: isCenter ? 1 : 0.85 ** absOffset,
                opacity: absOffset > 1 ? (isMobile ? 0 : 0.1) : (isCenter ? 1 : 0.4)
              }} 
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            >
              <img src={item.imageSrc} className="h-full w-full object-cover brightness-[0.7] group-hover:brightness-100 transition-all duration-700" alt={item.title} />
              
              {/* Dynamic Overlay */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                isCenter ? "bg-gradient-to-t from-black/80 via-transparent to-white/5" : "bg-black/60"
              )} />
              
              <div className="absolute bottom-0 p-8 w-full text-center">
                <motion.p 
                  animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                  className="text-brand-gold font-black text-xl tracking-[0.2em] uppercase drop-shadow-xl"
                >
                  {item.title}
                </motion.p>
              </div>

              {/* Reflection Shine */}
              {isCenter && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-[-20deg]"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
