"use client";

import { movieList } from "@/constant/images/image_list";
import { useTypewriter } from "@/hooks/useTypewriter";
import HomePage from "@/pages/home/Home";
import Image from "next/image";
import Link from "next/link";
import { PiArrowArcRightThin } from "react-icons/pi";

const Home = () => {
  const words = [
    "Movies",
    "Series",
    "Blockbusters",
    "Award Winners",
    "Classics",
    "Trending Now",
    "Watch Anytime",
    "On-Demand",
    "Unlimited Streaming",
    "All in One Place",
  ];
  const typedText = useTypewriter(words);

  return (
    <div className="dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Banner Section */}
      <div className="relative">
        <Image
          src={movieList.BannerImage}
          alt="Movie Banner"
          width={1920}
          height={400}
          className="w-full h-[28rem] object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#DBDBDA]/90 via-[#DBDBDA]/50 to-transparent" />
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-10">
          <div className="z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#2C3238] font-bold mb-4 leading-snug">
              The Greatest <span>{typedText}</span>
              <br />
              All In One Place
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#615f5f] font-semibold mb-5">
              Watch unlimited movies, TV shows, and much more
            </p>
            <div className="text-[#615f5f] mb-5">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1919]">
                $9.99
              </span>{" "}
              / per month
            </div>
            {/* Subscribe Button */}
            <Link
              href="/choose-a-plan"
              className="inline-block bg-[#CE3824] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-[#b8301f] transition"
            >
              Subscribe Now
            </Link>
            {/* Free Trial Note */}
            <div className="relative mt-6 sm:mt-8">
              <PiArrowArcRightThin className="absolute left-16 sm:left-20 text-2xl sm:text-3xl md:text-4xl text-[#636262] rotate-[230deg]" />
              <span className="absolute left-28 sm:left-36 text-[#535252] text-sm sm:text-base">
                Start your 7 day free trial
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Below */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HomePage />
      </div>
    </div>
  );
};

export default Home;
