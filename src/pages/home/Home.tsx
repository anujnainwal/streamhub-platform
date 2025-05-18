import React from "react";
import TVFrame from "./TVFrame";
import { movieList, TVFrameContent } from "@/constant/images/image_list";
import { PiDotOutlineFill, PiLock } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HomePage = () => {
  const movies = [
    {
      id: 1,
      title: "The Dark Knight",
      type: "Action",
      duration: "2h 32m",
      year: 2023,
      image: movieList.MOVIE_ACTION,
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
    },
    {
      id: 2,
      title: "Inception",
      type: "Sci-Fi",
      duration: "2h 28m",
      year: 2023,
      image: movieList.MOVIE_SCIENCE_FICTION,
      description:
        "A thief who steals corporate secrets through dream-sharing technology...",
    },
    {
      id: 3,
      title: "The Godfather",
      type: "Drama",
      duration: "2h 55m",
      year: 2023,
      image: movieList.MOVIE_DRAMA,
      description:
        "The aging patriarch of an organized crime dynasty transfers control to his son...",
    },
    {
      id: 4,
      title: "Interstellar",
      type: "Horror",
      duration: "2h 49m",
      year: 2023,
      image: movieList.MOVIE_HORROR,
      description: "A team of explorers travel through a wormhole in space...",
    },
  ];
  return (
    <div>
      {/* Tv Frame Content */}
      <div className="container mx-auto px-4 my-10 md:my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* TV Frame - Full width on mobile, half width on desktop */}
          <div className="w-full">
            <TVFrame src={TVFrameContent.MOVIE_ONE} />
          </div>

          {/* Content Section - Better spacing and responsive text */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl flex items-center justify-center md:justify-start font-bold text-gray-800">
              <PiDotOutlineFill color="red" className="text-2xl md:text-3xl" />
              <span>Enjoy Your Content</span>
            </h1>

            <p className="text-[grey] text-sm md:text-base lg:text-lg px-2 md:px-0 mt-4 md:mt-8">
              Stream your favorite movies, series, and classics anytime,
              anywhere—no ads, no limits.
            </p>

            <Button className="w-full md:w-auto p-4 md:p-6 lg:p-8 cursor-pointer bg-[#CE3824] text-white hover:bg-[#ECECEC] hover:text-[#000000d3] text-sm md:text-base transition-all duration-300">
              View Video Library
            </Button>
          </div>
        </div>
      </div>
      {/* All Tv love you */}
      <div className="py-20 ">
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center">
            <PiDotOutlineFill className="text-[#CE3824]" fontSize={30} />
            All the TV You Love
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Stream full seasons of exclusive series, current-season episodes,
            hit movies, kids <br />
            shows, and more.
          </p>
        </div>
        {/* card details */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className=" cursor-pointer
        relative 
        rounded-lg 
        overflow-hidden 
        shadow-lg 
        border-2 border-transparent       
        hover:border-red-500             
        transition-all duration-200 ease-in-out
      "
            >
              <Image
                src={movie.image}
                alt={movie.title}
                className="
          w-full 
          h-64 
          object-cover 
          transition-transform duration-300 
          group-hover:scale-105
        "
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-300">{movie.type}</p>
                </div>
                <span className="absolute -top-4 right-4 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                  <PiLock className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
