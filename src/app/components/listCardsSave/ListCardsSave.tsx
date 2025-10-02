"use client";

import { CardI } from "@/app/interfaces/card/card.interface";
import { useTheContext } from "@/app/services/globalContext";
import { CreditCard } from "lucide-react";

const ListCardsSave = ({ dataCard }: { dataCard: CardI[] }) => {
  const { selectedCard, handleSelectedCard } = useTheContext();

  return (
    <div>
      {dataCard.map((card) => (
        <label
          key={card.idRegisterCard}
          className={`block p-4 bg-white rounded-lg border-2 cursor-pointer transition-all mt-2 ${
            selectedCard === card.cardId
              ? "border-blue-500 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment-card"
              value={card.cardId}
              checked={selectedCard === card.cardId}
              onChange={handleSelectedCard}
              className="w-5 h-5 text-blue-600"
            />

            <div className="flex-shrink-0">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {card.brand}
                </span>
                <span className="text-sm text-gray-500">
                  •••• {card.lastFourDigits}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {card.brand}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                • Vence {card.expirationMonth} / {card.expirationYear}
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default ListCardsSave;
