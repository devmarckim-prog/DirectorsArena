import { useState, useEffect, useCallback, useRef } from "react";

export function useAutoSave<T>(
  key: string,
  data: T,
  onSave?: (data: T) => Promise<void>,
  delay: number = 3000
) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const initialMount = useRef(true);

  // Load from local storage initially
  const [localData, setLocalData] = useState<T | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`autosave_${key}`);
      if (stored) {
        try {
          setLocalData(JSON.parse(stored));
        } catch (e) {
          console.error("AutoSave load error", e);
        }
      }
    }
  }, [key]);

  const save = useCallback(
    async (currentData: T) => {
      setStatus('saving');
      
      // 1. Local Storage Auto-save (Instant)
      if (typeof window !== "undefined") {
        localStorage.setItem(`autosave_${key}`, JSON.stringify(currentData));
      }

      // 2. Cloud Sync (Debounced)
      if (onSave) {
        try {
          await onSave(currentData);
          setStatus('saved');
        } catch (error) {
          console.error("AutoSave sync error", error);
          setStatus('error');
        }
      } else {
        setStatus('saved');
      }

      setTimeout(() => setStatus('idle'), 2000);
    },
    [key, onSave]
  );

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, delay, save]);

  const restoreLocal = () => {
    return localData;
  };

  const clearLocal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`autosave_${key}`);
      setLocalData(null);
    }
  };

  return { status, localData, restoreLocal, clearLocal };
}
