"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { updateEpisodeScriptContentAction } from "@/app/actions";

interface Props {
  initialContent: string;
  projectId: string;
  episodeId: string;
}

// [SECURITY] Max characters allowed for rewrite - prevents massive API payloads
const MAX_SELECTION_CHARS = 2000;
// [SECURITY] Cooldown between rewrite calls in ms - prevents spam/cost abuse from UI
const REWRITE_COOLDOWN_MS = 3000;

export function InteractiveScriptViewer({ initialContent, projectId, episodeId }: Props) {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [lastRewriteTime, setLastRewriteTime] = useState(0); // [SECURITY] cooldown tracker
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Debounced auto-save with error handling
  useEffect(() => {
    if (content !== initialContent) {
      setSaveStatus('saving');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await updateEpisodeScriptContentAction(episodeId, projectId, content);
          if (res.success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
          }
        } catch {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      }, 2000);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [content, initialContent, episodeId, projectId]);

  const dismissToolbar = useCallback(() => {
    setShowToolbar(false);
    setSelectedRange(null);
    setInstruction("");
    setSelectionWarning(null);
  }, []);

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
    // [BUG FIX] Don't change selection while an AI rewrite is in progress
    if (isRewriting) return;

    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    if (start !== end) {
      const selectedLength = end - start;

      // [EDGE CASE] Zero-length selection (shouldn't happen but guard anyway)
      if (selectedLength === 0) {
        dismissToolbar();
        return;
      }

      // [SECURITY] Cap selection at MAX_SELECTION_CHARS to prevent massive payloads
      if (selectedLength > MAX_SELECTION_CHARS) {
        setSelectionWarning(`선택 범위가 너무 넓습니다 (${selectedLength}자). 최대 ${MAX_SELECTION_CHARS}자까지 선택 가능합니다.`);
        setShowToolbar(false);
        setSelectedRange(null);
        return;
      }

      setSelectionWarning(null);
      setSelectedRange({ start, end });
      setShowToolbar(true);
    } else {
      dismissToolbar();
    }
  };

  const handleRewrite = async () => {
    if (!selectedRange || !instruction || isRewriting) return;

    // [SECURITY] Client-side cooldown check to prevent button spam
    const now = Date.now();
    const msSinceLastRewrite = now - lastRewriteTime;
    if (msSinceLastRewrite < REWRITE_COOLDOWN_MS) {
      const remaining = Math.ceil((REWRITE_COOLDOWN_MS - msSinceLastRewrite) / 1000);
      setCooldownRemaining(remaining);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      cooldownRef.current = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setIsRewriting(true);
    setLastRewriteTime(now);

    try {
      const { start, end } = selectedRange;
      const originalText = content.slice(start, end);
      // [SECURITY] Additional server-side guard: send trimmed context
      const contextBefore = content.slice(Math.max(0, start - 200), start);
      const contextAfter = content.slice(end, Math.min(content.length, end + 200));

      const response = await fetch('/api/scenario/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText, contextBefore, contextAfter, userInstruction: instruction }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errData.error || `Server responded ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.text) {
        const newContent = content.slice(0, start) + data.text + content.slice(end);
        setContent(newContent);
        dismissToolbar();
      } else {
        throw new Error(data.error || 'No text returned');
      }
    } catch (err: any) {
      console.error("Rewrite failed:", err);
      alert("재작성 실패: " + err.message);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">

      {/* Header bar showing save status */}
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] text-neutral-500 font-mono">Interactive Editor · v3.3</span>
        <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest">
          {saveStatus === 'saving' && <><Loader2 size={12} className="animate-spin text-brand-gold" /><span className="text-brand-gold">Saving...</span></>}
          {saveStatus === 'saved' && <><Check size={12} className="text-green-500" /><span className="text-green-500">Saved</span></>}
          {saveStatus === 'error' && <span className="text-red-400">Save Error</span>}
          {saveStatus === 'idle' && <span className="text-neutral-600">Saved to Cloud</span>}
        </div>
      </div>

      {/* Selection warning banner */}
      {selectionWarning && (
        <div className="px-4 py-2 bg-yellow-950/30 border-b border-yellow-800/30 text-yellow-400 text-[11px] font-mono flex items-center justify-between">
          <span>⚠️ {selectionWarning}</span>
          <button onClick={() => setSelectionWarning(null)}><X size={12} /></button>
        </div>
      )}

      <div className="relative flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => !isRewriting && setContent(e.target.value)}
          onSelect={handleSelect}
          onBlur={(e) => {
            // Only dismiss if the blur target is NOT inside the toolbar
            const related = (e.relatedTarget as HTMLElement | null);
            if (!related?.closest('[data-toolbar]')) {
              // Don't dismiss on blur so user can type in the instruction input
            }
          }}
          readOnly={isRewriting}
          className={`w-full h-full min-h-[500px] bg-transparent text-neutral-300 text-sm leading-[2] font-mono resize-none focus:outline-none custom-scrollbar transition-opacity ${isRewriting ? 'opacity-50 cursor-wait' : 'opacity-100'}`}
          placeholder="Script content goes here..."
        />

        {/* Floating AI Toolbar */}
        {showToolbar && selectedRange && (
          <div
            data-toolbar="true"
            className="absolute z-50 bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl bg-black/95 backdrop-blur-xl border border-brand-gold/30 rounded-2xl shadow-2xl p-4"
          >
            <div className="flex items-center space-x-3">
              <Sparkles size={16} className="text-brand-gold shrink-0" />
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Ask AI to rewrite... (e.g., 이 씬을 더 긴장감 있게)"
                className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-neutral-600"
                onKeyDown={(e) => e.key === 'Enter' && !isRewriting && handleRewrite()}
                autoFocus
              />
              <button
                onClick={handleRewrite}
                disabled={isRewriting || !instruction || cooldownRemaining > 0}
                className="px-4 py-2 bg-brand-gold text-black hover:bg-brand-gold/80 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isRewriting ? (
                  <><Loader2 size={12} className="animate-spin" /> 작성중...</>
                ) : cooldownRemaining > 0 ? (
                  `대기 ${cooldownRemaining}s`
                ) : (
                  '✨ 재작성'
                )}
              </button>
              <button
                onClick={dismissToolbar}
                disabled={isRewriting}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-[9px] text-neutral-600 font-mono">
                선택: {selectedRange.end - selectedRange.start}자 / 최대 {MAX_SELECTION_CHARS}자
              </span>
              <span className="text-[9px] text-neutral-700">Enter로 실행</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
