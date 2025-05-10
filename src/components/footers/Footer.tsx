import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { exploreItems, accountItems, contactItems } from "./constant";
import Link from "next/link";

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebook, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaYoutube, href: "#" },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F2F3F9]">
      <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-4 p-3 md:p-5">
            <h2 className="text-xl md:text-2xl font-bold">Streamline hub</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
              nemo necessitatibus eum natus debitis,
            </p>
          </div>
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg">
              {exploreItems.title}
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm md:text-base">
              {exploreItems.items.map((item, index) => (
                <li
                  key={index}
                  className="hover:text-gray-900 cursor-pointer flex items-center gap-2 transition-colors duration-200"
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg">
              {accountItems.title}
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm md:text-base">
              {accountItems.items.map((item, index) => (
                <li
                  key={index}
                  className="hover:text-gray-900 cursor-pointer flex items-center gap-2 transition-colors duration-200"
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg">
              {contactItems.title}
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm md:text-base">
              {contactItems.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="border-gray-300" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm md:text-base">
          <div className="text-gray-600 text-center md:text-left">
            Lorem ipsum dolor sit amet, consect etur adi pisicing elit sed do
            eiusmod tempor incididunt ut labore et.
          </div>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <social.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
