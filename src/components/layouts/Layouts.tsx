import React from "react";
import Header from "../header/Header";
import Footer from "../footers/Footer";

interface LayoutsProps {
  children: React.ReactNode;
}
const Layouts = ({ children }: LayoutsProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <main className="flex-1 flex selection:bg-black selection:text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">{children}</div>
      </main> */}
      <main className="  selection:bg-black selection:text-white">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layouts;
