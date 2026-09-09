import { useState, useEffect, useRef, useCallback } from 'react';

const DEMO_DURATION = 90; // seconds in demo mode
const FULL_DURATION = 720; // 12 minutes

/**
 * Countdown timer hook with demo-mode support.
 * @param {boolean} isActive - Whether the countdown should be running
 * @param {boolean} demoMode - If true, compress 12min to ~90s
 * @param {function} onComplete - Callback when countdown reaches 0
 * @returns {{ timeRemaining, isWarning, isUrgent, progress }}
 */
export function useCountdown(isActive, demoMode = false, onComplete) {
  const totalDuration = demoMode ? DEMO_DURATION : FULL_DURATION;
  const [timeRemaining, setTimeRemaining] = useState(totalDuration);
  const [prevTotal, setPrevTotal] = useState(totalDuration);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  // Synchronize when duration changes
  if (totalDuration !== prevTotal) {
    setPrevTotal(totalDuration);
    setTimeRemaining(totalDuration);
  }

  useEffect(() => {
    hasCompletedRef.current = false;
  }, [totalDuration]);

  // Keep callback ref fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Tick every second
  useEffect(() => {
    if (!isActive || hasCompletedRef.current) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          hasCompletedRef.current = true;
          // Defer by 750ms for carrier wave collapse animation (Sprint 4 Climax)
          setTimeout(() => onCompleteRef.current?.(), 750);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const isWarning = timeRemaining <= 60 && timeRemaining > 10;
  const isUrgent = timeRemaining <= 10;
  const progress = 1 - timeRemaining / totalDuration;

  const reset = useCallback(() => {
    setTimeRemaining(totalDuration);
    hasCompletedRef.current = false;
  }, [totalDuration]);

  return { timeRemaining, isWarning, isUrgent, progress, reset, totalDuration };
}
