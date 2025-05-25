"use client";

import React from "react";
import { FaSpinner } from "react-icons/fa";

const sizeMap = {
  small: "w-4 h-4 text-xs",
  medium: "w-6 h-6 text-base",
  large: "w-10 h-10 text-2xl",
  extraLarge: "w-16 h-16 text-4xl",
};

type LoaderProps = {
  size?: "small" | "medium" | "large" | "extraLarge";
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center animate-spin text-blue-500 ${sizeMap[size]} ${className}`}
    >
      <FaSpinner />
    </span>
  );
};
