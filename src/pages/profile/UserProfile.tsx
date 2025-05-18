import { Button } from "@/components/ui/button";
import { movieImageList, UserImage } from "@/constant/images/image_list";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaRegBookmark, FaRegStar } from "react-icons/fa";
interface UserProfileProps {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  country?: string;
  state?: string;
  __v: number;
  fullName: string;
  id: string;
}

interface MyProfileProps {
  userInfo: UserProfileProps;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const watchList = [
    {
      id: 1,
      title: "The Dark Knight",
      type: "Action",
      image: movieImageList.MOVIE_ONE,
      alt: "dark knight",
    },
    {
      id: 2,
      title: "Inception",
      type: "Sci-Fi",
      image: movieImageList.MOVIE_TWO,
      alt: "inception",
    },
    {
      id: 3,
      title: "The Godfather",
      type: "Drama",
      image: movieImageList.MOVIE_THREE,
      alt: "the godfather",
    },
    {
      id: 4,
      title: "Interstellar",
      type: "Horror",
      image: movieImageList.MOVIE_FOUR,
      alt: "interstellar",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="min-h-screen py-8 flex flex-col items-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="destructive"
                className="rounded-l-none rounded-r-md shadow-md hover:scale-105 transition-transform"
              >
                Edit Profile
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                <Image
                  src={UserImage.DEFAULT}
                  alt="my-profile"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <h1 className="text-3xl font-extrabold mt-6 text-center text-gray-900 tracking-tight">
                {userInfo?.firstname} {userInfo?.lastname}
              </h1>
              <div className="flex justify-center gap-8 mt-4 mb-2">
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-lg font-semibold text-gray-700">
                    <FaRegBookmark className="text-blue-500" /> 20
                  </span>
                  <span className="text-xs text-gray-500">WatchList</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-lg font-semibold text-gray-700">
                    <FaRegStar className="text-yellow-500" /> 5
                  </span>
                  <span className="text-xs text-gray-500">Reviews</span>
                </div>
              </div>
            </div>
            <hr className="my-6" />
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-gray-600 font-medium">Bio</span>
                <span className="text-gray-900 text-right max-w-[60%] truncate">
                  {userInfo?.bio || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-gray-600 font-medium">Country</span>
                <span className="text-gray-900 text-right max-w-[60%] truncate">
                  {userInfo?.country || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-gray-600 font-medium">State</span>
                <span className="text-gray-900 text-right max-w-[60%] truncate">
                  {userInfo?.state || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-gray-600 font-medium">Member Since</span>
                <span className="text-gray-900 text-right max-w-[60%] truncate">
                  {userInfo?.createdAt
                    ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div>
            <h1 className="text-2xl font-bold mb-4">WatchList</h1>
            <hr className="mb-6 w-30 bg-red-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {watchList.map((item, idx) => {
              const [isHovered, setIsHovered] = useState(false);
              return (
                <motion.div
                  key={item.id}
                  className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-500 ease-in-out hover:shadow-xl"
                  whileHover={{ scale: 1.04 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <motion.div
                      className="relative w-full h-full"
                      animate={{ scale: isHovered ? 1.08 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 50vw"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-500 ${
                          isHovered ? "bg-black/20" : ""
                        }`}
                      ></div>
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">
                      {item.title}
                    </h3>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {item.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
