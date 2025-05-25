import React, { useState } from "react";
import getCardIcon from "@/constant/stripe/card";
import { BadgeCheck } from "lucide-react";

interface CardItemProps {
  card: {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: string;
    country: string;
    isDefault?: boolean;
  };
  onSetDefault: (cardId: string) => Promise<void>;
}

const CardItem: React.FC<CardItemProps> = ({ card, onSetDefault }) => {
  const [loading, setLoading] = useState(false);

  const handleRadioChange = async () => {
    if (card.isDefault || loading) return;
    setLoading(true);
    try {
      await onSetDefault(card.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Card Icon */}
        <div className="shrink-0">{getCardIcon(card.brand)}</div>

        {/* Card Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-lg font-semibold capitalize text-gray-800 truncate">
              {card.brand} •••• {card.last4}
            </p>
            {card.isDefault && (
              <span className="flex items-center text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                <BadgeCheck className="w-4 h-4 mr-1" />
                Default
              </span>
            )}
          </div>

          <div className="mt-1 text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Expires:</span>{" "}
              {String(card.expMonth).padStart(2, "0")}/{card.expYear}
            </p>
            <p>
              <span className="font-medium">Funding:</span> {card.funding} ·{" "}
              <span className="uppercase">{card.country}</span>
            </p>
          </div>
        </div>

        {/* Radio button */}
        <div className="ml-auto sm:ml-0 flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="defaultCard"
              checked={card.isDefault}
              onChange={handleRadioChange}
              disabled={loading}
              className="form-radio h-5 w-5 text-blue-600"
            />
            {loading && (
              <svg
                className="animate-spin ml-2 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
