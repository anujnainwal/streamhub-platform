"use client";
import React, { JSX } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb,
  FaCreditCard,
} from "react-icons/fa";

// Optional: For autocomplete/type safety, define known brands
export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "american express"
  | "discover"
  | "diners"
  | "diners club"
  | "jcb"
  | "unionpay"
  | "rupay"
  | "maestro"
  | "elo"
  | string; // to allow unknown brands

const getCardIcon = (brand?: CardBrand): JSX.Element => {
  if (!brand) {
    return <FaCreditCard className="text-gray-400 text-2xl mr-2" />;
  }

  switch (brand.toLowerCase()) {
    case "visa":
      return <FaCcVisa className="text-blue-600 text-2xl mr-2" />;
    case "mastercard":
      return <FaCcMastercard className="text-red-600 text-2xl mr-2" />;
    case "amex":
    case "american express":
      return <FaCcAmex className="text-indigo-600 text-2xl mr-2" />;
    case "discover":
      return <FaCcDiscover className="text-orange-500 text-2xl mr-2" />;
    case "diners":
    case "diners club":
      return <FaCcDinersClub className="text-purple-500 text-2xl mr-2" />;
    case "jcb":
      return <FaCcJcb className="text-green-600 text-2xl mr-2" />;

    default:
      return <FaCreditCard className="text-gray-400 text-2xl mr-2" />;
  }
};

export default getCardIcon;

export const brandGradientMap: Record<string, string> = {
  mastercard: "from-[#ff5f00] via-[#f79e1b] to-[#eb001b]", // orange-red gradient
  visa: "from-blue-600 to-blue-400", // blue gradient
  amex: "from-green-600 to-green-400", // green gradient
  discover: "from-yellow-400 to-yellow-300", // yellow gradient
  default: "from-gray-500 to-gray-400", // fallback gray gradient
};
