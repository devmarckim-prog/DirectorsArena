"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Languages, 
  Bell, 
  Lock, 
  User, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { cn } from "@/lib/utils";

import { getUserSettingsAction, updateUserSettingsAction } from "@/app/actions";

const LANGUAGES = [
  { id: "ko", name: "한국어", native: "Korean", flag: "KR" },
  { id: "en", name: "English", native: "English", flag: "US" },
  { id: "ja", name: "日本語", native: "Japanese", flag: "JP" }
];

export default function SettingsPage() {
  const [selectedLang, setSelectedLang] = useState("ko");
  const [activeTab, setActiveTab] = useState("general");
  const [isCinematicEnabled, setIsCinematicEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load Initial Settings
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getUserSettingsAction();
      if (settings) {
        if (settings.language) setSelectedLang(settings.language);
        if (settings.performance?.cinematicEffects !== undefined) {
          setIsCinematicEnabled(settings.performance.cinematicEffects);
        }
      }
    };
    loadSettings();
  }, []);

  // Save Settings when changed
  const saveSettings = async (updates: any) => {
    setIsSaving(true);
    const currentSettings = {
      language: selectedLang,
      performance: { cinematicEffects: isCinematicEnabled },
      ...updates
    };
    await updateUserSettingsAction(currentSettings);
    setIsSaving(false);
  };

  const handleLangChange = async (langId: string) => {
    setSelectedLang(langId);
    await saveSettings({ language: langId });
  };

  const toggleCinematic = async () => {
    const newVal = !isCinematicEnabled;
    setIsCinematicEnabled(newVal);
    await saveSettings({ performance: { cinematicEffects: newVal } });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
              <Settings className="text-brand-gold" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">Nexus Settings</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.4em]">Configure Your Creative Environment</p>
                {isSaving && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-brand-gold text-[8px] font-black uppercase tracking-widest animate-pulse"
                  >
                    • Saving Configuration...
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-2">
            {[
              { id: "general", label: "General", icon: Globe },
              { id: "account", label: "Account", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security & Privacy", icon: Lock },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-left group",
                  activeTab === item.id 
                    ? "bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shadow-[0_10px_30px_rgba(197,160,89,0.05)]" 
                    : "bg-transparent text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-transform duration-500",
                  activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div layoutId="activeTab" className="ml-auto">
                    <ChevronRight size={14} />
                  </motion.div>
                )}
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <main className="bg-neutral-900/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 lg:p-16 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Language Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <Languages className="text-brand-gold" size={20} />
                      <h2 className="text-lg font-black italic tracking-tight uppercase">System Language</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => handleLangChange(lang.id)}
                          className={cn(
                            "relative overflow-hidden p-6 rounded-3xl border transition-all duration-500 text-left group",
                            selectedLang === lang.id
                              ? "bg-brand-gold/5 border-brand-gold/50 shadow-[0_10px_40px_rgba(197,160,89,0.1)]"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex flex-col gap-1 relative z-10">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest transition-colors",
                              selectedLang === lang.id ? "text-brand-gold" : "text-neutral-500"
                            )}>
                              {lang.native}
                            </span>
                            <span className="text-lg font-bold">{lang.name}</span>
                          </div>
                          
                          {selectedLang === lang.id && (
                            <motion.div
                              layoutId="selectedLang"
                              className="absolute top-4 right-4"
                            >
                              <ShieldCheck className="text-brand-gold" size={20} />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="mt-6 text-neutral-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
                      * This setting changes the interface language of the Directors Arena Workspace and Nexus Command.
                    </p>
                  </section>

                  {/* Performance Section */}
                  <section className="pt-12 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                      <Zap className="text-brand-gold" size={20} />
                      <h2 className="text-lg font-black italic tracking-tight uppercase">Performance Protocol</h2>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold mb-1 uppercase tracking-tight">Cinematic Effects</h4>
                        <p className="text-xs text-neutral-500">Enable high-fidelity motion and transparency effects</p>
                      </div>
                      <div 
                        onClick={toggleCinematic}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 relative cursor-pointer border transition-all duration-500",
                          isCinematicEnabled ? "bg-brand-gold/20 border-brand-gold/30" : "bg-neutral-800 border-white/5"
                        )}
                      >
                        <motion.div 
                          animate={{ x: isCinematicEnabled ? 24 : 0 }}
                          className={cn(
                            "w-4 h-4 rounded-full shadow-lg transition-colors duration-500",
                            isCinematicEnabled ? "bg-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" : "bg-neutral-500"
                          )} 
                        />
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab !== "general" && (
                <motion.div
                  key="other"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 opacity-30"
                >
                  <Settings size={48} className="mb-4 animate-spin-slow" />
                  <p className="text-xs font-black uppercase tracking-[0.5em]">Module Synchronizing...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// Utility to wrap motion components if AnimatePresence is used
import { AnimatePresence } from "framer-motion";
