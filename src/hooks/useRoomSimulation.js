import { useState, useEffect, useRef, useCallback } from 'react';
import { pickMockParticipants, getMessagesForFrequency } from '../utils/pickMockParticipants.js';

/**
 * Simulates other participants in the room sending messages on a randomized cadence.
 * @param {string} frequencyId - Current frequency ID for message pool
 * @param {boolean} isActive - Whether the room is active
 * @returns {{ participants, messages, addUserMessage, resonanceLevel }}
 */
export function useRoomSimulation(frequencyId, isActive) {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const messagePoolRef = useRef([]);
  const messageIndexRef = useRef(0);
  const timersRef = useRef([]);
  const sendSimulatedMessageRef = useRef(null);

  const sendSimulatedMessage = useCallback((pickedParticipants, pool) => {
    if (!pickedParticipants || pickedParticipants.length === 0 || !pool || pool.length === 0) return;

    if (messageIndexRef.current >= pool.length) {
      // Reshuffle and restart
      messageIndexRef.current = 0;
      pool.sort(() => Math.random() - 0.5);
    }

    const participant = pickedParticipants[Math.floor(Math.random() * pickedParticipants.length)];
    const text = pool[messageIndexRef.current];
    messageIndexRef.current++;

    const newMessage = {
      id: `sim_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sender: participant.displayName,
      text,
      isUser: false,
      timestamp: Date.now(),
      resonated: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Schedule next message with randomized delay (3-7 seconds)
    const nextDelay = 3000 + Math.random() * 4000;
    const timer = setTimeout(() => {
      sendSimulatedMessageRef.current?.(pickedParticipants, pool);
    }, nextDelay);

    timersRef.current.push(timer);
  }, []);

  useEffect(() => {
    sendSimulatedMessageRef.current = sendSimulatedMessage;
  }, [sendSimulatedMessage]);

  // Initialize room when activated
  useEffect(() => {
    if (!isActive || !frequencyId) return;

    const picked = pickMockParticipants();
    setParticipants(picked);
    setMessages([]);
    setResonanceLevel(0);
    messageIndexRef.current = 0;

    const pool = getMessagesForFrequency(frequencyId);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    messagePoolRef.current = shuffled;

    // Start sending messages after a short delay
    const initialDelay = setTimeout(() => {
      if (shuffled.length > 0) {
        sendSimulatedMessage(picked, shuffled);
      }
    }, 1500 + Math.random() * 1000);

    timersRef.current.push(initialDelay);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isActive, frequencyId, sendSimulatedMessage]);

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
  }, []);

  const addResonance = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, resonated: true } : msg
      )
    );
    setResonanceLevel((prev) => Math.min(prev + 0.15, 1));

    // Decay resonance over time
    setTimeout(() => {
      setResonanceLevel((prev) => Math.max(prev - 0.05, 0));
    }, 3000);
  }, []);

  return {
    participants,
    messages,
    addUserMessage,
    addResonance,
    resonanceLevel,
  };
}
