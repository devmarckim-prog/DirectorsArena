"use client";

import { useState, useTransition } from "react";
import { toggleUserStatusAction } from "@/lib/actions/admin";
import { UserMinus, UserCheck, Loader2 } from "lucide-react";

interface UserStatusButtonProps {
  userId: string;
  currentStatus: string;
}

export function UserStatusButton({ userId, currentStatus }: UserStatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!confirm(`Are you sure you want to ${currentStatus === 'active' ? 'disable' : 'activate'} this user?`)) return;
    
    startTransition(async () => {
      await toggleUserStatusAction(userId, currentStatus);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-3 rounded-xl border transition-all ${
        currentStatus === 'active' 
          ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' 
          : 'border-green-500/20 text-green-500 hover:bg-green-500/10'
      } disabled:opacity-50`}
      title={currentStatus === 'active' ? 'Disable User' : 'Activate User'}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : currentStatus === 'active' ? (
        <UserMinus size={16} />
      ) : (
        <UserCheck size={16} />
      )}
    </button>
  );
}
