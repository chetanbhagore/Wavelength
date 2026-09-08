import { useState, useCallback, useMemo } from 'react';
import frequencies from '../data/frequencies.json';

/**
 * Custom hook managing the frequency dial state.
 * Handles rotation index, keyboard navigation, and snap-to-frequency logic.
 */
export function useDial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFrequency = useMemo(() => frequencies[currentIndex], [currentIndex]);
  const totalFrequencies = frequencies.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalFrequencies);
  }, [totalFrequencies]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalFrequencies) % totalFrequencies);
  }, [totalFrequencies]);

  const goTo = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalFrequencies - 1)));
  }, [totalFrequencies]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        goNext();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        goPrev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(totalFrequencies - 1);
        break;
    }
  }, [goNext, goPrev, goTo, totalFrequencies]);

  return {
    currentIndex,
    currentFrequency,
    totalFrequencies,
    frequencies,
    goNext,
    goPrev,
    goTo,
    handleKeyDown,
  };
}
