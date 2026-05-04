"use client";

import { useState } from "react";
import { manualCreditGrantAction } from "@/lib/actions/admin";
import { Send, Loader2 } from "lucide-react";

export function CreditGrantForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const email = formData.get("email") as string;
    const amount = parseInt(formData.get("amount") as string);
    const memo = formData.get("memo") as string;

    const result = await manualCreditGrantAction(email, amount, memo);

    if (result.success) {
      setMessage({ type: 'success', text: `${amount} credits granted to ${email} successfully.` });
      // Reset form would be nice, but for simplicity we show success message
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to grant credits.' });
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">User Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="director@example.com"
          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-brand-gold/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Amount</label>
          <input
            name="amount"
            type="number"
            required
            defaultValue={100}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Reason / Memo</label>
          <input
            name="memo"
            type="text"
            placeholder="Event Bonus / Support"
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
      </div>

      {message && (
        <p className={`text-[10px] font-bold uppercase tracking-widest text-center px-4 py-3 rounded-xl ${
          message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {message.text}
        </p>
      )}

      <button
        disabled={loading}
        className="w-full bg-brand-gold text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(197,160,89,0.2)] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span>Execute Provisioning</span>
            <Send size={14} strokeWidth={3} />
          </>
        )}
      </button>
    </form>
  );
}
