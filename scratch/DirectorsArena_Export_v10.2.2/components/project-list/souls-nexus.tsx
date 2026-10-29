"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, Zap, Sparkles, Activity, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

interface Character {
  id: string;
  name: string;
  job: string;
  gender: string;
  age?: number;
  secret?: string;
  look?: string;
  void?: string;
  desire?: string;
}

interface SoulsNexusProps {
  characters?: Character[]; // Made optional
}

export function SoulsNexus({ characters = [] }: SoulsNexusProps) {
  const [selectedId, setSelectedId] = useState<string | null>(characters?.[0]?.id || null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const protagonist = useMemo(() => 
    characters.find(c => c.job?.toLowerCase().includes("protagonist") || c.job === "Hero") || characters[0],
    [characters]
  );

  const others = useMemo(() => 
    characters.filter(c => c.id !== protagonist?.id),
    [characters, protagonist]
  );

  const toggleSecret = (id: string) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Nexus Map Positions: Calibrated for Central Gravity
  const nodePositions = useMemo(() => {
    if (!protagonist) return {};
    const positions: Record<string, { x: number; y: number }> = {
      [protagonist.id]: { x: 50, y: 50 } // Absolute Center
    };

    if (others.length > 0) {
      others.forEach((char, i) => {
        const angle = (2 * Math.PI * i) / others.length;
        const radius = 35; // Positioned on the orbital rail
        positions[char.id] = {
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle)
        };
      });
    }

    return positions;
  }, [protagonist, others]);

  // Relationship Logic: Psych-Visual Calibration
  const getRelationship = (char: Character) => {
    const job = char.job?.toLowerCase() || "";
    if (job.includes("antagonist") || job.includes("enemy") || job.includes("rival")) {
      return { label: "Mortal Enemies", type: "enemy", color: "#EF4444" };
    }
    if (job.includes("mentor") || job.includes("family") || job.includes("loyal") || job.includes("ally")) {
      return { label: "Loyal Blood", type: "ally", color: "#C5A059" };
    }
    return { label: "Fated Convergence", type: "neutral", color: "#4B5563" };
  };

  if (!characters || characters.length === 0) {
    return (
      <div className="h-[calc(100vh-320px)] flex flex-col items-center justify-center border border-white/5 bg-black/40 rounded-[3rem]">
        <Fingerprint className="text-brand-gold opacity-20 mb-6 animate-pulse" size={48} />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">No Souls Registered in the Void</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-320px)] gap-10">
      {/* [LEFT] The Soul Roster (30%) */}
      <div className="w-[300px] flex flex-col space-y-4 overflow-y-auto pr-4 scrollbar-hide">
        <div className="flex items-center space-x-3 mb-6">
           <Users className="text-brand-gold" size={16} />
           <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">The Character Roster</h3>
        </div>
        
        {characters.map((char) => (
          <button
            key={char.id}
            onClick={() => setSelectedId(char.id)}
            className={cn(
              "p-6 rounded-3xl border transition-all duration-500 text-left group relative overflow-hidden shrink-0",
              selectedId === char.id 
                ? "bg-brand-gold/10 border-brand-gold h-28" 
                : "bg-white/5 border-white/5 hover:border-white/20 h-24"
            )}
          >
            {selectedId === char.id && (
              <motion.div 
                layoutId="activeRosterGlow"
                className="absolute inset-0 bg-brand-gold/5 pointer-events-none"
              />
            )}
            <div className="relative z-10">
              <h4 className={cn(
                "text-lg font-bold uppercase italic transition-colors leading-none mb-1",
                selectedId === char.id ? "text-brand-gold" : "text-white/60 group-hover:text-white"
              )}>
                {char.name}
              </h4>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                {char.job || "The Character"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* [RIGHT] The Character Network (70%) */}
      <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] relative overflow-hidden flex flex-col">
        {/* Starfield Particles (Atmosphere Calibration) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.4 
              }}
              animate={{ 
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4 + Math.random() * 4, 
                repeat: Infinity 
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
            />
          ))}
        </div>

        <div className="flex-1 relative">
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
             {protagonist && others.map((char) => {
               const start = nodePositions[protagonist.id];
               const end = nodePositions[char.id];
               
               if (!start || !end) return null;
               
               const rel = getRelationship(char);
               const isSelected = selectedId === char.id || selectedId === protagonist.id;
               
               return (
                 <g key={char.id}>
                    {/* Glow effect for red lines */}
                    {rel.type === "enemy" && (
                      <motion.line
                        x1={start.x + "%"}
                        y1={start.y + "%"}
                        x2={end.x + "%"}
                        y2={end.y + "%"}
                        stroke={rel.color}
                        strokeWidth="4"
                        strokeOpacity="0.1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isSelected ? 0.15 : 0.05 }}
                      />
                    )}
                   <motion.line
                     x1={start.x + "%"}
                     y1={start.y + "%"}
                     x2={end.x + "%"}
                     y2={end.y + "%"}
                     stroke={rel.color}
                     strokeWidth="1.5"
                     strokeOpacity={isSelected ? "0.6" : "0.2"}
                     strokeDasharray={rel.type === "enemy" ? "6 4" : "0"}
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: isSelected ? 0.6 : 0.2 }}
                     transition={{ duration: 1.5, delay: 0.5 }}
                   />
                   <motion.text
                     initial={{ opacity: 0 }}
                     animate={{ opacity: isSelected ? 1 : 0.3 }}
                     x={(start.x + end.x) / 2 + "%"}
                     y={(start.y + end.y) / 2 - 2 + "%"}
                     textAnchor="middle"
                     className="text-[8px] font-black uppercase tracking-[0.2em] fill-brand-gold/40 italic select-none"
                   >
                     {rel.label}
                   </motion.text>
                 </g>
               );
             })}
           </svg>

           {/* Nodes */}
           {characters.map((char) => {
             const pos = nodePositions[char.id];
             const isSelected = selectedId === char.id;
             const isProtag = char.id === protagonist?.id;

             return (
               <motion.button
                 key={char.id}
                 onClick={() => setSelectedId(char.id)}
                 className={cn(
                   "absolute w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 z-20 group backdrop-blur-sm",
                   isSelected ? "scale-125 border-brand-gold bg-brand-gold/20 shadow-[0_0_25px_rgba(197,160,89,0.4)]" : "border-white/10 bg-neutral-950/80 hover:border-white/30",
                   isProtag ? "w-20 h-20 border-brand-gold/50 bg-brand-gold/5" : ""
                 )}
                 style={{ 
                   left: `calc(${pos.x}% - ${isProtag ? '40px' : '32px'})`, 
                   top: `calc(${pos.y}% - ${isProtag ? '40px' : '32px'})` 
                 }}
               >
                 {isSelected && (
                   <motion.div 
                     layoutId="nodeGlow"
                     className="absolute inset-[-8px] rounded-full border border-brand-gold/30"
                   />
                 )}
                 <div className="flex flex-col items-center">
                   <div className="text-[12px] font-black text-white leading-none">
                     {char.name.substring(0, 1)}
                   </div>
                   {isSelected && (
                      <span className="text-[6px] font-black text-brand-gold mt-1 uppercase tracking-tighter">Active</span>
                   )}
                 </div>
               </motion.button>
             );
           })}
        </div>
        
        {/* Detail Soul Card (Bottom Overlay) */}
        <AnimatePresence mode="wait">
          {selectedId && (
            <motion.div
              key={selectedId}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-10 left-10 right-10 bg-neutral-950/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] z-30"
            >
              {(() => {
                const char = characters.find(c => c.id === selectedId);
                if (!char) return null;
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="space-y-4">
                       <h5 className="text-2xl font-black text-brand-gold uppercase italic">{char.name}</h5>
                       <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{char.job}</p>
                       <div className="flex space-x-2">
                         {["#Ambitious", "#Unstable", "#Vengeful"].map(tag => (
                           <span key={tag} className="text-[7px] text-brand-gold/40 font-mono">{tag}</span>
                         ))}
                       </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Internal Want</span>
                          <p className="text-xs text-white/80 italic leading-relaxed">"To retrieve the stolen memory before the city falls."</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">External Need</span>
                          <p className="text-xs text-white/80 italic leading-relaxed">"To confront the figure in the rain-drenched cafe."</p>
                       </div>
                    </div>

                    <div className="bg-black/40 rounded-3xl p-8 relative flex flex-col justify-center border border-white/5 h-28">
                        <span className="text-[8px] font-black text-brand-gold/40 uppercase tracking-[0.4em] mb-2">Classified Agenda</span>
                        <motion.p 
                          animate={{ filter: revealedSecrets[char.id] ? "blur(0px)" : "blur(8px)", opacity: revealedSecrets[char.id] ? 1 : 0.3 }}
                          className="text-xs text-brand-gold font-bold italic select-none"
                        >
                           {char.secret || "No deep secret registered in the Void."}
                        </motion.p>
                        {!revealedSecrets[char.id] ? (
                          <button 
                            onClick={() => toggleSecret(char.id)}
                            className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white hover:text-brand-gold transition-colors uppercase tracking-[0.3em]"
                          >
                             Acknowledge Secret
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleSecret(char.id)}
                            className="absolute top-4 right-6 text-[8px] font-black text-neutral-700 hover:text-brand-gold transition-colors uppercase"
                          >
                             Hide
                          </button>
                        )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
