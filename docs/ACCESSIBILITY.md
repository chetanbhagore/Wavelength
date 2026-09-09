# ♿ Wavelength — Accessibility (a11y) & Inclusivity Specification

> **Document Version**: 4.3.0  
> **Compliance Target**: WCAG 2.1 AA / AAA Standards  
> **Audit Coverage**: Screen Readers, Keyboard Navigation, Contrast Ratios, Reduced Motion  

---

## 🧭 Semantic Roles & ARIA Architecture

Wavelength bridges physical analog metaphors (such as radio dials) with assistive technology standards:

### 1. The Analog Frequency Rotary Dial
The rotary dial is implemented with the W3C Slider Design Pattern:
```jsx
<div
  role="slider"
  tabIndex={0}
  aria-label="Radio Frequency Tuner"
  aria-valuemin={0}
  aria-valuemax={frequencies.length - 1}
  aria-valuenow={currentIndex}
  aria-valuetext={`${currentFreq.mhz} MegaHertz: ${currentFreq.name}, ${currentFreq.essence}`}
  onKeyDown={handleKeyDown}
/>
```
- **Keyboard Shortcuts**:
  - `ArrowRight` / `ArrowUp`: Advance to next frequency (+1 station, synthesized detent click).
  - `ArrowLeft` / `ArrowDown`: Step to previous frequency (-1 station, synthesized detent click).
  - `Home`: Snap to first station (88.5 MHz).
  - `End`: Snap to final station (107.9 MHz).
  - `Enter` / `Space`: Activate Tune In sequence.

### 2. High Contrast Ratios (WCAG AAA Compliance)
- **Primary Text (`#F5F3F7`) on Background (`#05060A`)**: Contrast ratio **18.7:1** (exceeds WCAG AAA 7:1 requirement).
- **Accent Purple (`#7C5CFF`) on Background (`#05060A`)**: Contrast ratio **5.4:1** (exceeds WCAG AA 4.5:1 for UI elements).
- **Resonance Glow (`#33E6C9`) on Surface (`#10131C`)**: Contrast ratio **11.8:1**.

### 3. Focus Management & Universal Visibility
All interactive elements feature unmistakable focus indicators with purple glowing rings:
```css
:focus-visible {
  outline: 2px solid var(--color-gradient-start);
  outline-offset: 2px;
  box-shadow: var(--shadow-glow-sm);
}
```

### 4. Reduced Motion (`prefers-reduced-motion: reduce`)
For users with vestibular motion disorders or sensitive visual preferences, all background sinusoidal oscillation, stardust motes, CRT jitter, and 3D card drop accelerations gracefully fall back to zero transform and instantaneous transitions:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Screen Reader Live Announcements
- Ephemeral arrival toasts announce stranger presence via `aria-live="polite"`.
- Countdown alerts announce remaining room time at critical milestones (1 minute, 30 seconds).
- Message bubbles carry clear sender attribution (`aria-label="Message from stranger 42: ..."`).
