"use client";

import { useState } from "react";
import { Plus, Coins, Loader2 } from "lucide-react";
import { manualCreditGrantAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

interface CreditGrantButtonProps {
  userEmail: string;
}

export function CreditGrantButton({ userEmail }: CreditGrantButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleGrant = async () => {
    const amountStr = prompt(`Grant credits to ${userEmail}:\n(Enter a positive number to add, negative to subtract)`);
    if (!amountStr) return;

    const amount = parseInt(amountStr);
    if (isNaN(amount)) {
      alert("Please enter a valid number");
      return;
    }

    const memo = prompt("Enter a reason for this grant:", "Manual adjustment by Admin");
    if (memo === null) return;

    setIsPending(true);
    try {
      const result = await manualCreditGrantAction(userEmail, amount, memo);
      if (result.success) {
        alert(`Successfully granted ${amount} credits to ${userEmail}`);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleGrant}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-black transition-all active:scale-95 group",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">Grant</span>
      <Coins size={12} />
    </button>
  );
}
