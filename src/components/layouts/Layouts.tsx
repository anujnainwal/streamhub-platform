"use client";
import React from "react";
import Header from "../header/Header";
import Footer from "../footers/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { FaArrowUp } from "react-icons/fa";

interface LayoutsProps {
  children: React.ReactNode;
}
const Layouts = ({ children }: LayoutsProps) => {
  const { scrollToTop, showButton } = useScrollToTop();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative selection:bg-black selection:text-white">
        {children}
      </main>
      <Footer />
      <button
        onClick={scrollToTop}
        className={`fixed cursor-pointer bottom-8 right-8 px-4 py-3 bg-[#9A9A9A] text-white rounded-[5px] shadow-lg hover:bg-[#b8301f] transition-all duration-300 z-50 ${
          showButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
      >
        <FaArrowUp fontSize={20} />
      </button>
    </div>
  );
};
export default Layouts;
