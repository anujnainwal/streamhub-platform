"use client";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footers/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { FaArrowUp } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetBillingPortalQuery } from "@/features/subscriptionApi/subscriptionApi";
import { useRouter } from "next/navigation";

interface LayoutsProps {
  children: React.ReactNode;
}

const Layouts = ({ children }: LayoutsProps) => {
  let router = useRouter();
  const { scrollToTop, showButton } = useScrollToTop();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // adjust key if needed
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { data, isLoading, error } = useGetBillingPortalQuery(undefined, {
    skip: !token, // 🛑 Skip query if token not present
  });

  return (
    <>
      {data && !data?.data?.isCardAttached && (
        <Alert className="flex items-center gap-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 p-4">
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <AlertTitle className="font-semibold">Update Your Card</AlertTitle>
            <AlertDescription>
              Your subscription will end soon. Please update your payment card
              to avoid interruption of service.
            </AlertDescription>
          </div>
          <button
            className="ml-4 px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={() => router.push(`${data?.data?.url}`)}
          >
            Update Card
          </button>
        </Alert>
      )}

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
    </>
  );
};

export default Layouts;
