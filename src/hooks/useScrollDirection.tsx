import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down";

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateDirection = () => {
      const currentScrollY = window.pageYOffset;
      // If scrolled more than 0px
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;

      setDirection(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateDirection);
    return () => window.removeEventListener("scroll", updateDirection);
  }, []);

  return direction;
}
