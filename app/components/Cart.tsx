
'use client';

import React from 'react';
import { useState, useEffect } from 'react';

// Define the type for an item in our shopping cart
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Define the props for the Cart component
interface CartProps {
  cartItems: CartItem[];
  show: boolean;
  onClose: () => void;
  onRemove: (itemId: number) => void;
}

/**
 * A modal component to display the contents of the shopping cart.
 * @param {CartProps} props The component props.
 * @returns {JSX.Element} The rendered cart modal.
 */
const Cart: React.FC<CartProps> = ({ cartItems, show, onClose, onRemove }) => {
  // Calculate the total price of all items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full m-4">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h2 className="text-2xl text-gray-600 font-semibold">Your Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h3 className="text-blue-600 text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      ${item.price} x {item.quantity} = ${item.price * item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t flex justify-between items-center text-gray-600">
              <h3 className="text-xl font-bold">Total:</h3>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
