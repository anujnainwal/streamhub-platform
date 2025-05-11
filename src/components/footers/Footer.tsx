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
    <footer className="bg-[#F2F3F9] min-h-[500px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Streamline hub
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
              nemo necessitatibus eum natus debitis,
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              {exploreItems.title}
            </h3>
            <ul className="space-y-4">
              {exploreItems.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                >
                  {item.icon && (
                    <item.icon className="text-gray-500" size={16} />
                  )}
                  <span className="text-base">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              {accountItems.title}
            </h3>
            <ul className="space-y-4">
              {accountItems.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                >
                  {item.icon && (
                    <item.icon className="text-gray-500" size={16} />
                  )}
                  <span className="text-base">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              {contactItems.title}
            </h3>
            <ul className="space-y-4">
              {contactItems.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <span className="text-base">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
          <div className="text-gray-600 text-center md:text-left max-w-xl">
            Devlopeed By RiftCode1999. All right are reseved.
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <social.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
