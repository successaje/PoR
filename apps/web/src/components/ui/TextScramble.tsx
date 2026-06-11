"use client";

import { useState, useEffect, useRef } from "react";

interface TextScrambleProps {
  text: string | number;
  duration?: number;
  className?: string;
  delay?: number;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function TextScramble({ text, duration = 800, className = "", delay = 0 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState<string>("");
  const targetText = String(text);
  const frameRef = useRef<number | null>(null);
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char: string }[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const length = targetText.length;
      const queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        const to = targetText[i];
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40) + (duration / 20);
        queue.push({ from, to, start, end, char: "" });
      }
      
      queueRef.current = queue;
      frameCountRef.current = 0;
      cancelAnimationFrame(frameRef.current!);
      update();
    };

    const update = () => {
      let output = "";
      let complete = 0;
      
      for (let i = 0, n = queueRef.current.length; i < n; i++) {
        let { from, to, start, end, char } = queueRef.current[i];
        
        if (frameCountRef.current >= end) {
          complete++;
          output += to;
        } else if (frameCountRef.current >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            queueRef.current[i].char = char;
          }
          output += `<span class="opacity-50">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      setDisplayText(output);
      
      if (complete === queueRef.current.length) {
        cancelAnimationFrame(frameRef.current!);
      } else {
        frameRef.current = requestAnimationFrame(update);
        frameCountRef.current++;
      }
    };

    if (delay > 0) {
      // initial scramble
      setDisplayText(Array(targetText.length).fill("0").join(""));
      timeoutId = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      cancelAnimationFrame(frameRef.current!);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [targetText, duration, delay]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: displayText }} />;
}
