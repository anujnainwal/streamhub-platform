"use client";
import { useState, useEffect } from "react";

export function useTypewriter(
  words: string[],
  typingSpeed = 120, // slower typing
  pause = 500 // longer pause at end
) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pause);
    } else {
      timeout = setTimeout(
        () => {
          if (isDeleting) {
            setText(currentWord.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
            if (charIndex === 0) {
              setIsDeleting(false);
              setWordIndex((wordIndex + 1) % words.length);
            }
          } else {
            setText(currentWord.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
            if (charIndex === currentWord.length) {
              setIsPaused(true); // pause before deleting
            }
          }
        },
        isDeleting ? typingSpeed : typingSpeed
      ); // smooth delete = same speed
    }

    return () => clearTimeout(timeout);
  }, [
    text,
    isDeleting,
    charIndex,
    wordIndex,
    words,
    typingSpeed,
    pause,
    isPaused,
  ]);

  // Smooth cursor blink (faster, finer blink)
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 400); // blink every 400ms for smoother look

    return () => clearInterval(cursorInterval);
  }, []);

  const cursor = showCursor ? "|" : " ";

  return text + cursor;
}
