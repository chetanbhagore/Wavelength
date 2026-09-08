import { useState, useEffect, useRef, useCallback } from 'react';
import { pickMockParticipants, getMessagesForFrequency } from '../utils/pickMockParticipants.js';

/**
 * Simulates lifelike co-presence in the room:
 * - Dynamic typing indicators ("stranger_XX is typing...") with human pauses
 * - Organic conversational bursts and thoughtful lulls
 * - Simulated peer resonance when poignant messages or user messages drop
 * @param {string} frequencyId - Current frequency ID for message pool
 * @param {boolean} isActive - Whether the room is active
 * @returns {{ participants, messages, addUserMessage, addResonance, resonanceLevel, typingParticipant, surgeTrigger }}
 */
export function useRoomSimulation(frequencyId, isActive) {
  const [participants, setParticipants] = useState(() => (isActive && frequencyId ? pickMockParticipants() : []));
  const [messages, setMessages] = useState([]);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [typingParticipant, setTypingParticipant] = useState(null);
  const [surgeTrigger, setSurgeTrigger] = useState(0);

  const messagePoolRef = useRef([]);
  const messageIndexRef = useRef(0);
  const timersRef = useRef([]);
  const participantsRef = useRef(participants);
  const scheduleNextMessageRef = useRef(null);

  // Keep ref up to date
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Resonance trigger helper with room surge feedback
  const triggerResonanceSurge = useCallback(() => {
    setSurgeTrigger((c) => c + 1);
    setResonanceLevel((prev) => Math.min(prev + 0.18, 1));

    // Slow organic decay
    const decayTimer = setTimeout(() => {
      setResonanceLevel((prev) => Math.max(prev - 0.06, 0));
    }, 3200);
    timersRef.current.push(decayTimer);
  }, []);

  const addResonance = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, resonated: true } : msg
      )
    );
    triggerResonanceSurge();
  }, [triggerResonanceSurge]);

  // Simulated peer resonance: strangers occasionally resonate with messages
  const maybeTriggerPeerResonance = useCallback((targetMessageId) => {
    const peerDelay = 2200 + Math.random() * 3000;
    const timer = setTimeout(() => {
      if (Math.random() < 0.55) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === targetMessageId ? { ...msg, resonated: true } : msg
          )
        );
        triggerResonanceSurge();
      }
    }, peerDelay);
    timersRef.current.push(timer);
  }, [triggerResonanceSurge]);

  // Schedule typing and then dispatching a simulated message
  const executeSimulatedTurn = useCallback(() => {
    const currentParticipants = participantsRef.current;
    const pool = messagePoolRef.current;
    if (!currentParticipants || currentParticipants.length === 0 || !pool || pool.length === 0) return;

    if (messageIndexRef.current >= pool.length) {
      messageIndexRef.current = 0;
      pool.sort(() => Math.random() - 0.5);
    }

    const speaker = currentParticipants[Math.floor(Math.random() * currentParticipants.length)];
    const text = pool[messageIndexRef.current];
    messageIndexRef.current++;

    // Step 1: Start typing indicator
    setTypingParticipant(speaker);

    // Realistic human typing duration based on message length (1.6s to 3.2s)
    const typingDuration = Math.min(3600, Math.max(1600, text.length * 45 + Math.random() * 800));

    const dropTimer = setTimeout(() => {
      setTypingParticipant(null);

      const newMessage = {
        id: `sim_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        sender: speaker.displayName,
        avatarColor: speaker.avatarColor,
        text,
        isUser: false,
        timestamp: Date.now(),
        resonated: false,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Potential peer resonance on this new message
      maybeTriggerPeerResonance(newMessage.id);

      // Step 2: Schedule next turn with organic conversational cadence
      // 60% standard lull (4s - 7s), 25% quick response burst (1.8s - 3s), 15% thoughtful pause (8s - 12s)
      const roll = Math.random();
      let nextCadence;
      if (roll < 0.25) {
        nextCadence = 1800 + Math.random() * 1200; // Burst
      } else if (roll < 0.85) {
        nextCadence = 3800 + Math.random() * 3200; // Normal
      } else {
        nextCadence = 7500 + Math.random() * 4500; // Thoughtful pause
      }

      const nextTurnTimer = setTimeout(() => {
        scheduleNextMessageRef.current?.();
      }, nextCadence);

      timersRef.current.push(nextTurnTimer);
    }, typingDuration);

    timersRef.current.push(dropTimer);
  }, [maybeTriggerPeerResonance]);

  useEffect(() => {
    scheduleNextMessageRef.current = executeSimulatedTurn;
  }, [executeSimulatedTurn]);

  // Initialize room when frequency or active state changes
  useEffect(() => {
    if (!isActive || !frequencyId) return;

    let initTimer;
    let turnTimer;

    initTimer = setTimeout(() => {
      const picked = pickMockParticipants();
      setParticipants(picked);
      participantsRef.current = picked;
      setMessages([]);
      setResonanceLevel(0);
      setTypingParticipant(null);
      messageIndexRef.current = 0;

      const pool = getMessagesForFrequency(frequencyId);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      messagePoolRef.current = shuffled;

      // First message starts typing immediately after arrival (Sprint 2 Issue #26)
      turnTimer = setTimeout(() => {
        if (shuffled.length > 0) {
          scheduleNextMessageRef.current?.();
        }
      }, 800 + Math.random() * 500);
      timersRef.current.push(turnTimer);

      // Mid-session rare ambient arrival/departure event (Sprint 2 Issue #27)
      const ambientEventTimer = setTimeout(() => {
        if (Math.random() < 0.6) {
          // New presence arrives
          const newStranger = {
            id: `p_new_${Date.now()}`,
            displayName: `stranger_${Math.floor(Math.random() * 70) + 30}`,
            avatarColor: '#33E6C9',
          };
          setParticipants((prev) => [...prev, newStranger]);
          setMessages((prev) => [
            ...prev,
            {
              id: `sys_join_${Date.now()}`,
              isSystem: true,
              text: `${newStranger.displayName} tuned into this frequency`,
            },
          ]);
        } else {
          // A presence softly departs
          const leaving = participantsRef.current[participantsRef.current.length - 1];
          if (leaving && participantsRef.current.length > 3) {
            setParticipants((prev) => prev.filter((p) => p.id !== leaving.id));
            setMessages((prev) => [
              ...prev,
              {
                id: `sys_leave_${Date.now()}`,
                isSystem: true,
                text: `${leaving.displayName} drifted back into the void`,
              },
            ]);
          }
        }
      }, 26000 + Math.random() * 10000);
      timersRef.current.push(ambientEventTimer);
    }, 0);

    timersRef.current.push(initTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setTypingParticipant(null);
    };
  }, [isActive, frequencyId]);


  const addUserMessage = useCallback((text) => {
    const newMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sender: 'you',
      text,
      isUser: true,
      timestamp: Date.now(),
      resonated: false,
    };
    setMessages((prev) => [...prev, newMessage]);

    // High likelihood of a peer resonating with the user's message! (Emotional affirmation)
    maybeTriggerPeerResonance(newMessage.id);

    // Prompt a conversational response sooner after the user speaks
    const followUpTimer = setTimeout(() => {
      if (!typingParticipant) {
        scheduleNextMessageRef.current?.();
      }
    }, 2400 + Math.random() * 1800);
    timersRef.current.push(followUpTimer);
  }, [maybeTriggerPeerResonance, typingParticipant]);

  return {
    participants,
    messages,
    addUserMessage,
    addResonance,
    resonanceLevel,
    typingParticipant,
    surgeTrigger,
  };
}

