import React from 'react';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, items } = useCart();
  
  // Check if product already in cart
  const isInCart = items.some(item => item._id === product._id);
  const cartItem = items.find(item => item._id === product._id);
  
  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      // Success message show karo
      alert(`${product.name} added to cart! 🛒`);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 mb-2">
              <ShoppingCartIcon className="h-8 w-8 text-indigo-400" />
            </div>
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
            product.stock > 0 
              ? 'bg-green-500/90 text-white shadow-lg' 
              : 'bg-red-500/90 text-white shadow-lg'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
        </div>

        {/* Quick View Badge */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600/90 text-white shadow-lg backdrop-blur-sm">
            Quick View
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
            <span className="text-xs text-gray-500">per item</span>
          </div>
          
          {/* Rating */}
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">4.0 (12)</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
            product.stock > 0
              ? isInCart 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>
            {product.stock === 0 
              ? 'Out of Stock' 
              : isInCart 
                ? `${cartItem ? cartItem.quantity : 0} in Cart` 
                : 'Add to Cart'
            }
          </span>
        </button>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-bl-2xl opacity-10"></div>
    </div>
  );
};

export default ProductCard;
