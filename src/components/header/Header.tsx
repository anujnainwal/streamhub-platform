"use client";
import React, { useEffect, useState } from "react";
import {
  FaStream,
  FaCreditCard,
  FaBars,
  FaUser,
  FaTimes,
  FaSearch,
  FaHome,
  FaFilm,
  FaTv,
  FaMicrophone,
  FaListUl,
} from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { Button } from "../ui/button";
import Joi from "joi";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import UserProfile from "./UserProfile";
import LoginPage from "@/app/login/LoginPage";

const Header = () => {
  let router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  let dispatch = useDispatch();

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
  let authInfo = useSelector((state?: any) => state.authInfo);

  const itemList = authInfo?.token
    ? [
        {
          id: 1,
          label: "Home",
          icon: FaHome,
          value: "",
        },
        {
          id: 2,
          label: "Movies",
          icon: FaFilm,
          value: "movies",
        },
        {
          id: 3,
          label: "Series",
          icon: FaTv,
          value: "series",
        },
        {
          id: 4,
          label: "Podcasts",
          icon: FaMicrophone,
          value: "podcasts",
        },
        {
          id: 5,
          label: "Watch List",
          icon: FaListUl,
          value: "watch-list",
        },
      ]
    : [
        {
          id: 1,
          label: "Home",
          icon: FaHome,
          value: "",
        },
        {
          id: 2,
          label: "Subscribe Now",
          icon: FaCreditCard,
          value: "login",
        },
      ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("userInfo");
      if (token && userInfo) {
        dispatch(
          setCredentials({
            token: JSON.parse(token),
            userInfo: JSON.parse(userInfo),
          })
        );
      }
    }
  }, [dispatch]);

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      {itemList.map((item: any) => (
        <Link
          key={item.id}
          href={`/${item.value}`}
          onClick={onClick}
          className="flex items-center px-4 py-2 text-white hover:bg-gray-700 text-sm"
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-gray-900 text-white shadow sticky top-0 z-50">
      <div className="mx-auto max-w-screen-xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <FaStream className="text-white text-2xl" />
          <span className="ml-2 text-xl font-bold">StreamHub</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {/* {itemList.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.value)}
              className="flex cursor-pointer items-center text-sm font-medium text-gray-300 hover:text-white transition"
            >
              <item.icon className="mr-2 text-base" />
              {item.label}
            </button>
          ))} */}
          <NavItems onClick={() => setIsMenuOpen(false)} />
        </div>

        <div className="flex items-center gap-4">
          {!authInfo?.token ? (
            <Button
              onClick={() => setOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white border border-gray-500 hover:bg-gray-700"
            >
              Login
            </Button>
          ) : (
            <UserProfile
              userInfo={authInfo?.userInfo}
              onSignOut={() => console.log("sd")}
            />
          )}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-md bg-gray-800 overflow-hidden shadow-lg space-y-2 pb-4">
            {authInfo?.token ? (
              <NavItems onClick={() => setIsMenuOpen(false)} />
            ) : (
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-white hover:bg-gray-700 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            )}

            {authInfo?.token && (
              <div className="px-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none text-sm placeholder-gray-400"
                  />
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <LoginPage type="loginModal" setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
