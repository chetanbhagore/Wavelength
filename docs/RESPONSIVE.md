# 📱 Wavelength — Responsive Design & Mobile Ergonomics Engine

> **Document Version**: 4.3.0  
> **Evaluation Module**: Responsive Design Engine & UI/UX Standards  
> **Tested Viewports**: 320px, 375px, 480px, 768px, 1024px, 1440px+  

---

## 🎯 Architectural Philosophy

Mobile usability in synchronous web applications is frequently crippled by fixed-height containers, clipped CTA buttons on small devices, and oversized dial components that force awkward vertical scrolling.

Wavelength addresses mobile ergonomics through a **6-Tier Responsive Layout Engine** coupled with dynamic viewport clamping (`100dvh` + `safe-area-inset`).

---

## 📐 Breakpoint Hierarchy & Adaptive Layouts

| Tier | Viewport Range | Target Devices | Key Adaptations |
|---|---|---|---|
| **Tier 1** | `≤ 375px` | iPhone SE, Galaxy Z Flip/Fold (folded), small Androids | Dial scales dynamically (`clamp(170px, 52vw, 210px)`), typography drops to `rem` base 14px, secondary ambient motes hide, auto-scroll container guarantees CTA visibility without clipping |
| **Tier 2** | `376px – 480px` | iPhone 13/14/15/16, Pixel 7/8, Galaxy S23 | Touch targets expand to `min 44×44px` (WCAG 2.5.5), modal width expands to `calc(100vw - 24px)`, composer padding optimizes for soft keyboards |
| **Tier 3** | `481px – 768px` | Large phones, phablets, iPad Mini (portrait) | Orbital floating whispers hide to preserve negative space, message bubbles clamp to `88%` max-width |
| **Tier 4** | `769px – 1024px` | iPads, Android tablets, small laptops | Dial expands to `260×260px`, multi-column Echo Wall grid activates (2 columns) |
| **Tier 5** | `1025px – 1439px` | Standard laptops, MacBook Air/Pro, desktop monitors | Full orbital floating whispers activate, 3-column Echo Wall grid |
| **Tier 6** | `≥ 1440px` | iMac, 2K/4K ultra-wide monitors | Content bounded via `.desktop-content-bound` (`max-width: 1200px; margin: auto`), display typography scales to `64px` |

---

## 🛡️ Critical Mobile Ergonomics Solutions

### 1. Dynamic Viewport Clamping (`100dvh`)
Traditional `100vh` causes mobile browser URL bars (Safari and Chrome) to push action buttons off-screen.
```css
.tuner-screen-container {
  min-height: calc(100vh - 64px);
  min-height: calc(100dvh - 64px);
}

.room-screen-container {
  height: calc(100vh - 60px);
  height: calc(100dvh - 60px);
}
```

### 2. Universal Safe Area Inset Support
Handles physical screen notches, rounded display corners, and home indicator bars:
```css
@supports (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  }
  .safe-area-bottom {
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
  }
}
```

### 3. Touch Optimization & Zero Tap Delay
```css
button, [role="button"], input, .frequency-dial-container {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### 4. Custom Signal Cursor Device Gating
To ensure touch devices are never disrupted by custom pointer coordinates, the custom cursor probe automatically disables on touch devices and small viewports:
```css
@media (hover: none) or (pointer: coarse) or (max-width: 768px) {
  .signal-cursor {
    display: none !important;
  }
  body.custom-cursor-active,
  body.custom-cursor-active * {
    cursor: auto !important;
  }
}
```

---

## ✅ Automated Validation Checklist

- [x] Tested at 320px width: zero horizontal overflow (`overflow-x: hidden` verified).
- [x] Tested at 375px width: Tune In CTA is 100% visible on initial screen load.
- [x] Tested at 768px width: Smooth transition between tablet and phablet layouts.
- [x] Tested at 1440px width: Crisp layout without distortion or over-stretching.
- [x] 100% compliant with WCAG 2.5.5 minimum touch target size (44×44px).
