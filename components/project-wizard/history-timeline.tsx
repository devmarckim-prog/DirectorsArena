"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe, MapPin, History, Calendar, Search, 
  Sword, Landmark, Coins, Atom, Palette, 
  Users, Flame, Zap, Compass, Navigation,
  ChevronUp, ChevronDown
} from "lucide-react";
import { HISTORICAL_DATA, getEventsForYear, getNearbyEvents, HistoricalEvent } from "@/lib/constants/history";

interface HistoryTimelineProps {
  initialYear?: number;
  initialRegion?: 'KR' | 'GLOBAL';
  onYearChange: (year: number) => void;
  onRegionChange: (region: 'KR' | 'GLOBAL') => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  WAR: Sword,
  POLITICS: Landmark,
  ECONOMY: Coins,
  SCIENCE: Atom,
  CULTURE: Palette,
  SOCIETY: Users,
  RELIGION: Flame,
  DISASTER: Zap,
  TECHNOLOGY: Compass,
  DISEASE: Flame // Fallback for disease
};

export function HistoryTimeline({ initialYear = 2026, initialRegion = 'KR', onYearChange, onRegionChange }: HistoryTimelineProps) {
  const [year, setYear] = useState(initialYear);
  const [region, setRegion] = useState<'KR' | 'GLOBAL'>(initialRegion);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<HistoricalEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatYear = (y: number) => {
    if (y < 0) return `BC ${Math.abs(y)}`;
    return `${y}`;
  };

  // Non-linear mapping logic
  // Slider raw value: 0 to 1000 (for higher precision)
  // 0 -> -1000, 500 -> 2026, 1000 -> 2200
  const PAST_RANGE = 2026 - (-1000); // 3026
  const FUTURE_RANGE = 2200 - 2026; // 174
  const K = 2.2; // Acceleration factor

  const yearToSlider = (y: number) => {
    if (y === 2026) return 500;
    if (y < 2026) {
      const ratio = (2026 - y) / PAST_RANGE;
      return 500 - 500 * Math.pow(ratio, 1/K);
    } else {
      const ratio = (y - 2026) / FUTURE_RANGE;
      return 500 + 500 * Math.pow(ratio, 1/K);
    }
  };

  const sliderToYear = (s: number) => {
    const t = (s - 500) / 500; // -1 to 1
    if (t === 0) return 2026;
    if (t < 0) {
      return Math.round(2026 - PAST_RANGE * Math.pow(Math.abs(t), K));
    } else {
      return Math.round(2026 + FUTURE_RANGE * Math.pow(t, K));
    }
  };

  useEffect(() => {
    const s = region === 'KR' ? 'kr' : 'global';
    const currentEvents = getEventsForYear(year, s);
    setEvents(currentEvents);
    
    if (currentEvents.length === 0) {
      setNearbyEvents(getNearbyEvents(year, s, 10));
    } else {
      setNearbyEvents([]);
    }
    
    onYearChange(year);
  }, [year, region, onYearChange]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = sliderToYear(parseInt(e.target.value));
    if (newYear !== year) triggerHaptic();
    setYear(newYear);
  };

  const handleYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingYear(false);
    triggerHaptic();
  };

  const incrementYear = () => {
    setYear(prev => Math.min(2200, prev + 1));
    triggerHaptic();
  };

  const decrementYear = () => {
    setYear(prev => Math.max(-1000, prev - 1));
    triggerHaptic();
  };

  const toggleRegion = (newRegion: 'KR' | 'GLOBAL') => {
    triggerHaptic();
    setRegion(newRegion);
    onRegionChange(newRegion);
  };

  const goToToday = () => {
    setYear(2026);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 py-8 bg-neutral-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl overflow-hidden relative min-h-[450px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      
      {/* 1. HORIZONTAL SCROLL AREA (Context Cards) */}
      <div className="w-full overflow-x-auto pb-4 px-8 no-scrollbar">
        <AnimatePresence mode="wait">
          <div className="flex space-x-6 min-h-[140px]">
            {events.length > 0 ? (
              events.slice(0, 5).map((event, idx) => {
                const Icon = CATEGORY_ICONS[event.tag] || Globe;
                return (
                  <motion.div
                    key={`${event.year}-${event.title}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, delay: idx * 0.05 }}
                    className="w-64 flex-shrink-0 p-4 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 flex flex-col justify-between group hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[9px] font-black text-brand-gold/80 uppercase tracking-[0.2em]">{event.tag}</span>
                         <Icon size={12} className="text-white/20 group-hover:text-brand-gold/60 transition-colors" />
                      </div>
                      <h4 className="text-[12px] font-black text-white mt-1 group-hover:text-brand-gold transition-colors leading-tight">{event.title}</h4>
                      <p className="text-[10px] text-white/40 line-clamp-2 mt-2 leading-relaxed font-medium group-hover:text-white/60 transition-colors">{event.desc}</p>
                    </div>
                  </motion.div>
                );
              })
            ) : nearbyEvents.length > 0 ? (
              <div className="flex items-center space-x-6">
                <div className="text-white/20 font-black uppercase tracking-widest text-[9px] w-20 text-center">
                  Nearby Context
                </div>
                {nearbyEvents.slice(0, 3).map((event, idx) => {
                  const Icon = CATEGORY_ICONS[event.tag] || Globe;
                  return (
                    <motion.div
                      key={`${event.year}-${event.title}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-64 flex-shrink-0 p-5 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md relative group hover:bg-brand-gold/5 transition-all overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[8px] font-bold text-white/40 uppercase">{event.year} • {event.tag}</span>
                         <Icon size={10} className="text-white/10" />
                      </div>
                      <h4 className="text-[11px] font-bold text-white/80 truncate">{event.title}</h4>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-white/10 font-black uppercase tracking-widest text-[10px] py-8">
                No events recorded for this period
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* 2. CENTER CONTROL (Timeline + Region) */}
      <div className="relative w-full flex items-center px-10 max-w-5xl">
        {/* Region Selector (Left) */}
        <div className="flex flex-col space-y-2 mr-10 relative z-20">
          <button 
            onClick={() => toggleRegion('KR')}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border group relative overflow-hidden",
              region === 'KR' 
                ? "bg-brand-gold border-brand-gold text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]" 
                : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            <span className="text-[10px] font-black relative z-10">KR</span>
          </button>
          <button 
            onClick={() => toggleRegion('GLOBAL')}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border group relative overflow-hidden",
              region === 'GLOBAL' 
                ? "bg-brand-gold border-brand-gold text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]" 
                : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
            )}
          >
            <Globe size={16} className="relative z-10" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 relative flex flex-col items-center">
          <div 
            className="mb-1 h-16 flex items-center justify-center relative cursor-pointer group" 
            onClick={() => setIsEditingYear(true)}
          >
            <div className="relative flex items-center justify-center w-full">
              {isEditingYear ? (
                <motion.form 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  onSubmit={handleYearSubmit}
                  className="flex items-center"
                >
                  <div className="flex items-center text-[4.5rem] font-black italic tracking-tighter text-white">
                    {year < 0 && <span className="mr-4 text-brand-gold/60 text-4xl">BC</span>}
                    <input
                      autoFocus
                      ref={inputRef}
                      type="number"
                      value={Math.abs(year)}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setYear(year < 0 ? -val : val);
                      }}
                      onBlur={() => setIsEditingYear(false)}
                      className="bg-transparent text-white w-full max-w-[280px] text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  
                  {/* Custom Up/Down Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col ml-6 space-y-2"
                  >
                    <button 
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); incrementYear(); }}
                      className="p-1.5 bg-white/5 hover:bg-brand-gold hover:text-black rounded-xl transition-all border border-white/10"
                    >
                      <ChevronUp size={16} strokeWidth={4} />
                    </button>
                    <button 
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); decrementYear(); }}
                      className="p-1.5 bg-white/5 hover:bg-brand-gold hover:text-black rounded-xl transition-all border border-white/10"
                    >
                      <ChevronDown size={16} strokeWidth={4} />
                    </button>
                  </motion.div>
                </motion.form>
              ) : (
                <div className="flex items-center select-none">
                   <motion.span 
                     key={year}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-[4.5rem] font-black text-white italic tracking-tighter drop-shadow-[0_5px_20px_rgba(255,255,255,0.15)] group-hover:text-brand-gold transition-colors duration-500"
                   >
                     {formatYear(year)}
                   </motion.span>
                </div>
              )}

              {/* Reset Indicator (Independent of Edit State) */}
              <AnimatePresence>
                {year !== 2026 && !isEditingYear && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); goToToday(); }}
                    className="absolute -bottom-6 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all duration-300 group/today"
                  >
                    <Navigation size={10} className="group-hover/today:rotate-45 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Present</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Range Track */}
          <div className="w-full h-1.5 bg-white/5 rounded-full relative group mt-8">
             <div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-gold/40 to-brand-gold shadow-[0_0_25px_rgba(197,160,89,0.4)] rounded-full transition-all duration-300" 
               style={{ width: `${(yearToSlider(year) / 1000) * 100}%` }} 
             />
             <input
               type="range"
               min="0"
               max="1000"
               value={yearToSlider(year)}
               onChange={handleSliderChange}
               className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
             />
             
             {/* Slider Thumb Handle */}
             <motion.div 
               className="absolute -top-2.5 w-7 h-7 bg-white rounded-full border-[5px] border-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.8)] pointer-events-none flex items-center justify-center"
               animate={{ left: `${(yearToSlider(year) / 1000) * 100}%` }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               style={{ marginLeft: '-14px' }}
             >
               <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
             </motion.div>
          </div>
          
          <div className="w-full flex justify-center mt-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] px-2">
             <span className="text-brand-gold/40">The Present</span>
          </div>
        </div>
      </div>

      {/* 3. DECORATIVE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cinematic Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-[0.03]" />
        
        {/* Glow behind year */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full" />
        
        {/* Corner Accents */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10 rounded-tl-3xl" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10 rounded-br-3xl" />
      </div>
    </div>
  );
}
