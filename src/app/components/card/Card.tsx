"use client";

import { Eye, Heart, ShoppingCart, Star, StarIcon } from "lucide-react";

const Card = ({ currentProduct }: { currentProduct: any }) => {
  return (
    <div className="bg-gray-50 p-4 flex justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
        {/* Badge & Discount */}
        <div className="relative">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="h-56 w-full object-contain p-4"
          />
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {/* {currentProduct.badge} */}1
          </div>
          {/* {currentProduct.discount && (
            <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{currentProduct.discount}%
            </div>
          )} */}
          {/* Floating Buttons */}
          <div className="absolute top-16 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition">
              <Heart size={16} />
            </button>
            <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition">
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pb-4">
          {/* Provider & Verified */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">
              {/* {currentProduct.provider} */}
              Proveedor 1
            </span>
            {/* {currentProduct.verified && (
              <Check size={14} className="text-green-600" />
            )} */}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star
              size={16}
              className={`${
                Math.floor(currentProduct.rating.rate)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />

            {/* <span className="text-xs text-gray-500">
               ({currentProduct.reviews}) 1
            </span> */}
          </div>

          {/* Title & Description */}
          <h3 className="text-sm font-semibold text-gray-800 mt-2 line-clamp-2">
            {currentProduct.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {currentProduct.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-black">
              ${currentProduct.price} MXN
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 border text-black rounded-md  transition">
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>

            <button className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition">
              <Heart size={16} />
              Comprar ahora
            </button>

            <button className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition">
              <StarIcon size={16} />
              Agregar a favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
