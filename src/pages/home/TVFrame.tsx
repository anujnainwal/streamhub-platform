import React from "react";
import Image, { StaticImageData } from "next/image";

interface TVFrameProps {
  src: string | StaticImageData;
  alt?: string;
  width?: string;
  className?: string;
}
const TVFrame: React.FC<TVFrameProps> = ({
  src,
  alt = "TV Content",
  width = "w-75 md:w-[600px]",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* TV Body */}
      <div
        className={`relative ${width} aspect-video
          bg-gray-800 rounded-2xl overflow-hidden
          border-8 border-gray-400
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]`}
      >
        {/* Glass Sheen Overlay */}
        <div
          className="pointer-events-none absolute inset-0
          bg-gradient-to-t from-black/25 via-transparent to-black/10 mix-blend-overlay"
        />
        {/* Inner Shadow */}
        <div className="pointer-events-none absolute inset-0 shadow-inner" />

        {/* Screen Image */}
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      {/* Stand */}
      <div className="relative mt-6">
        {/* Center post */}
        <div className="w-4 h-8 bg-gray-400 rounded-t-lg mx-auto" />
        {/* Angled legs */}
        <div className="absolute top-full left-1/2 flex -translate-x-1/2 space-x-4 mt-1">
          <div className="w-4 h-1 bg-gray-400 rotate-[-15deg] origin-left rounded" />
          <div className="w-4 h-1 bg-gray-400 rotate-[15deg] origin-right rounded" />
        </div>
      </div>
    </div>
  );
};

export default TVFrame;
