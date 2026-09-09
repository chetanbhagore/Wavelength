/**
 * @module constants
 * Centralized application constants and configuration values.
 * All magic numbers, timing values, and configuration are defined here
 * to enforce single-source-of-truth across the Wavelength application.
 */

// ─── Session & Timer Configuration ───────────────────────────────────────────

/** Duration of a demo session in seconds (90s quick preview) */
export const DEMO_DURATION = 90;

/** Duration of a standard session in seconds (12 minutes) */
export const FULL_DURATION = 720;

/** Delay before session-end callback fires to allow collapse animation (ms) */
export const SESSION_END_DELAY_MS = 750;

/** Duration of the dissolution phase at end of room session (seconds) */
export const DISSOLUTION_PHASE_SECONDS = 30;

// ─── Room Simulation Configuration ──────────────────────────────────────────

/** Minimum typing duration for simulated messages (ms) */
export const MIN_TYPING_DURATION_MS = 1600;

/** Maximum typing duration for simulated messages (ms) */
export const MAX_TYPING_DURATION_MS = 3600;

/** Typing speed factor (ms per character) */
export const TYPING_SPEED_FACTOR = 45;

/** Probability of a peer resonating with a message */
export const PEER_RESONANCE_PROBABILITY = 0.55;

/** Base delay before peer resonance triggers (ms) */
export const PEER_RESONANCE_BASE_DELAY_MS = 2200;

/** Additional random delay range for peer resonance (ms) */
export const PEER_RESONANCE_RANDOM_RANGE_MS = 3000;

/** Resonance energy increment per resonance event */
export const RESONANCE_INCREMENT = 0.18;

/** Resonance energy decay amount */
export const RESONANCE_DECAY = 0.06;

/** Delay before resonance decay starts (ms) */
export const RESONANCE_DECAY_DELAY_MS = 3200;

/** Maximum resonance energy level */
export const MAX_RESONANCE_LEVEL = 1;

// ─── UI Timing & Animation ─────────────────────────────────────────────────

/** Duration of the arrival banner display (ms) */
export const ARRIVAL_BANNER_DURATION_MS = 3200;

/** First-resonance philosophy toast display duration (ms) */
export const PHILOSOPHY_TOAST_DURATION_MS = 3600;

/** Resonance flash animation duration (ms) */
export const RESONANCE_FLASH_DURATION_MS = 1200;

/** Auto-dismiss timer for tuner guidance hint (ms) */
export const GUIDANCE_DISMISS_MS = 9000;

/** Demo mode toast display duration (ms) */
export const DEMO_TOAST_DURATION_MS = 2500;

/** TopBar auto-dim inactivity threshold (ms) */
export const TOPBAR_INACTIVITY_MS = 2400;

/** Detent snap animation duration (ms) */
export const SNAP_DURATION_MS = 240;

/** Particle burst cleanup delay (ms) */
export const PARTICLE_CLEANUP_MS = 380;

// ─── Dial & Interaction ─────────────────────────────────────────────────────

/** Number of stardust particles emitted on detent snap */
export const SNAP_PARTICLE_COUNT = 8;

/** Minimum drag distance to trigger next/prev frequency (px) */
export const DRAG_THRESHOLD_PX = 50;

/** Maximum 3D tilt angle for the dial (degrees) */
export const DIAL_TILT_MAX_DEG = 6.5;

/** Frequency dial size constraints */
export const DIAL_SIZE = {
  min: '195px',
  preferred: '50vw',
  max: '300px',
};

// ─── Message Composer ───────────────────────────────────────────────────────

/** Maximum character count for user messages */
export const MAX_MESSAGE_CHARS = 200;

/** Character count threshold to show remaining chars counter */
export const CHAR_COUNTER_THRESHOLD = 170;

// ─── Audio Synthesis ────────────────────────────────────────────────────────

/** Lock chime frequency in Hz (528 Hz — Solfeggio "Love" frequency) */
export const LOCK_CHIME_FREQUENCY_HZ = 528;

/** Auto-scan steps range [min, max] */
export const AUTO_SCAN_STEPS = { min: 5, max: 9 };

/** Auto-scan interval between steps (ms) */
export const AUTO_SCAN_INTERVAL_MS = 170;

// ─── Breakpoints ────────────────────────────────────────────────────────────

/** Responsive design breakpoints in pixels */
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1440,
};

// ─── App State Machine ──────────────────────────────────────────────────────

/** Valid application states for the navigation state machine */
export const APP_STATES = {
  TUNER: 'tuner',
  SYNCING: 'syncing',
  ROOM: 'room',
  ECHO_MODAL: 'echoModal',
  ECHO_WALL: 'echoWall',
};

// ─── LocalStorage Keys ──────────────────────────────────────────────────────

/** Keys used for localStorage persistence */
export const STORAGE_KEYS = {
  LAST_VISITED_FREQUENCY: 'wavelength_last_visited_id',
  FREQUENCY_HISTORY: 'wavelength_frequency_history',
  ECHO_HISTORY: 'myEchoHistory',
  TUNER_GUIDANCE_SEEN: 'wavelength_tuner_guidance_seen',
};
