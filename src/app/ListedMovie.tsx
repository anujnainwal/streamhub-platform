"use client";

import { useEffect, useRef, useState } from "react";
import { movieList } from "@/constant/movieList/movieList";
import { FaArrowAltCircleLeft, FaPlay } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";

const ListedMovie = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);
  const totalSlides = movieList.length;

  // Function to start autoplay
  const startAutoSlide = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 5000);
    }
  };

  // Function to stop autoplay
  const stopAutoSlide = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // On mount, start carousel
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleOpenTrailer = (url: string) => {
    setActiveTrailerUrl(url);
    stopAutoSlide(); // ❌ Stop carousel
  };

  const handleCloseTrailer = () => {
    setActiveTrailerUrl(null);
    startAutoSlide(); // ✅ Resume carousel
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Carousel Container */}
      <div className="w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {movieList.map((movie) => (
            <div
              key={movie.id}
              className="w-full flex-shrink-0 h-[85vh] relative"
              style={{ minWidth: "100%" }}
            >
              <Image
                src={movie.backgroundImage}
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />

              {/* Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

              {/* Overlay Content */}
              <div className="absolute pl-10 inset-0 bg-black/40 flex items-center z-20">
                <div className="pl-12 text-white max-w-xl space-y-4">
                  <span className="border px-2 py-1 mb-3.5 text-xs font-semibold tracking-widest bg-white/10 rounded">
                    {movie.type}
                  </span>
                  <h2 className="text-4xl font-bold mt-2.5">{movie.title}</h2>
                  <p className="text-sm text-gray-200">
                    {movie.releaseYear} &nbsp; | &nbsp; {movie.duration} &nbsp;
                    | &nbsp; {movie.category}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {movie.description}
                  </p>

                  {/* Custom Modal Trigger */}
                  <button
                    onClick={() => handleOpenTrailer(movie.trailerUrl)}
                    className="inline-flex cursor-pointer items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md mt-2 transition"
                  >
                    <FaPlay className="text-sm" />
                    <span>Watch Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white cursor-pointer hover:bg-white/30 p-2 rounded-full"
      >
        <FaArrowAltCircleLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white cursor-pointer hover:bg-white/30 p-2 rounded-full"
      >
        <FaArrowAltCircleLeft className="transform rotate-180" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {movieList.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Custom Trailer Modal */}
      {activeTrailerUrl && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={handleCloseTrailer}
            className="absolute top-4 right-4 cursor-pointer text-[#e91515] bg-black/60 hover:bg-black/80 p-2 rounded-full z-50 transition"
          >
            <RxCross2 className="w-5 h-5" />
          </button>

          <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl aspect-video relative">
            <iframe
              src={activeTrailerUrl
                .replace("watch?v=", "embed/")
                .concat("?autoplay=1&controls=1&modestbranding=1")}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-md shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListedMovie;
