import { useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Globe, Landmark
} from "lucide-react";
import { HistoryTimeline } from "./history-timeline";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

export function StepThree({ formData, setFormData, onNext }: StepThreeProps) {
  const handleYearChange = useCallback((year: number) => {
    setFormData((prev: any) => ({
      ...prev,
      world: { ...prev.world, year }
    }));
  }, [setFormData]);

  const handleRegionChange = useCallback((region: 'KR' | 'GLOBAL') => {
    setFormData((prev: any) => ({
      ...prev,
      world: { ...prev.world, region }
    }));
  }, [setFormData]);

  return (
    <div className="w-full flex flex-col space-y-8 pb-8">
      {/* 1. World Stage: FocusRail */}
      <section className="space-y-6">
        <div className="w-full flex justify-between items-end mb-4">
          <div className="text-left">
            <motion.h2 
              className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tighter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              당신의 이야기가 펼쳐질<br />무대를 선택해 주세요
            </motion.h2>
            <p className="text-neutral-500 font-medium tracking-wide uppercase text-sm">
              이 이야기는 언제를 배경으로 하나요?
            </p>
          </div>
          </div>

        <HistoryTimeline 
          initialYear={formData.world?.year}
          initialRegion={formData.world?.region}
          onYearChange={handleYearChange}
          onRegionChange={handleRegionChange}
        />
      </section>
    </div>
  );
}
