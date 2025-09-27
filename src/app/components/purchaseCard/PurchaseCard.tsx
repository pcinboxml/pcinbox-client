import { Calendar, ArrowRight } from "lucide-react";

interface PurchaseCardProps {
  title: string;
  store: string;
  date: string;
  price: number;
  status: string;
  category: string;
}

const PurchaseCard = ({
  title,
  store,
  date,
  price,
  status,
  category,
}: PurchaseCardProps) => {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm my-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{store}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">${price}</p>
          <p className="text-sm text-gray-500 capitalize">{status}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Entregado: {date}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
          {category}
        </span>
      </div>
      <button className="mt-4 w-full flex items-center justify-center text-blue-600 hover:underline text-sm font-medium">
        Ver detalles <ArrowRight className="ml-1 w-4 h-4" />
      </button>
    </div>
  );
};

export default PurchaseCard;
