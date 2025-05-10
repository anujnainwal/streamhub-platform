"use client";
import React, { useState } from "react";
import {
  FaStream,
  FaCreditCard,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { Button } from "../ui/button";
import { userInfo, isSubscribed } from "@/userInfo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Joi from "joi";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    rememberMe: Joi.boolean(),
  });

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });

    if (!error) {
      setErrors({ email: "", password: "" });
      return true;
    }

    const newErrors = { email: "", password: "" }; // ensure both keys exist

    error.details.forEach((detail) => {
      const key = detail.path[0] as keyof typeof newErrors;
      if (key === "email" || key === "password") {
        newErrors[key] = detail.message;
      }
    });

    setErrors(newErrors);
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formData);
      // Handle form submission
    }
  };

  const itemList = [
    {
      id: 1,
      label: "Video Library",
      icon: MdVideoLibrary,
      value: "video-library",
    },
    ...(!isSubscribed(userInfo)
      ? [
          {
            id: 2,
            label: "Subscribe Now",
            icon: FaCreditCard,
            value: "subscribe-now",
          },
        ]
      : [
          {
            id: 2,
            label: "Watch List",
            icon: FaCreditCard,
            value: "Watch List",
          },
        ]),
  ];

  return (
    <div className="sticky top-0 z-50 bg-white flex flex-col md:flex-row justify-between border-b border-gray-200 p-5">
      <div className="flex justify-between items-center">
        <Link href="/">
          <span className="font-bold flex gap-2 justify-center items-center cursor-pointer">
            <FaStream fontSize={15} />
            Streaming Hub
          </span>
        </Link>
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-5 justify-center items-center mt-4 md:mt-0 transition-all duration-300 ease-in-out`}
      >
        <ul className="flex flex-col md:flex-row gap-4">
          {itemList.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 text-[#747574] hover:text-[#000000e1] cursor-pointer transition-colors duration-200"
            >
              <item.icon fontSize={15} />
              {item.label}
            </li>
          ))}
        </ul>
        <hr className="w-full md:w-auto md:h-10 border-t md:border-t-0 md:border-l border-gray-200 self-center" />
        {isSubscribed(userInfo) ? (
          <div className="flex items-center gap-2 cursor-pointer">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUser className="w-8 h-8 p-1 rounded-full bg-gray-200" />
            )}
            <span className="text-sm font-medium">{userInfo.username}</span>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#ee2626] w-full md:w-auto cursor-pointer text-white hover:bg-white hover:text-black transition-all duration-300 border border-[#ff6b6b] hover:shadow-md">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-700">
                  Please Login
                </DialogTitle>
                <DialogDescription>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="space-y-5">
                      {/* Username / Email Field */}
                      <div className="relative">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full mt-1 rounded-md border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="relative">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full mt-1 rounded-md border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Remember Me + Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <label
                            htmlFor="rememberMe"
                            className="ml-2 text-sm text-gray-600 select-none"
                          >
                            Remember me
                          </label>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-red-600 hover:underline hover:text-red-500 transition"
                        >
                          Forgot Password?
                        </a>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full rounded-md bg-red-600 py-3 text-white font-semibold hover:bg-red-700 transition-colors"
                      >
                        LOGIN
                      </Button>

                      {/* Sign-up Link */}
                      <div className="text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <a
                          href="#"
                          className="text-red-600 font-medium hover:underline hover:text-red-500 transition"
                        >
                          Sign up
                        </a>
                      </div>
                    </div>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Header;
