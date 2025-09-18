'use client';

import React, { useState } from 'react';

// Define the type for an item in the shopping cart
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Define the props for the Checkout component
interface CheckoutProps {
  cartItems: CartItem[];
  show: boolean;
  onClose: () => void;
  onConfirmOrder: (summary: { fullName: string; email: string; total: number }) => void;
}

/**
 * A modal component for the checkout page.
 * @param {CheckoutProps} props The component props.
 * @returns {JSX.Element | null} The rendered checkout modal or null if not shown.
 */
const Checkout: React.FC<CheckoutProps> = ({ cartItems, show, onClose, onConfirmOrder }) => {
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Calculate the total price of all items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted!');
    onConfirmOrder({
      fullName,
      email,
      total: cartTotal,
    });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-3xl text-gray-800 font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary Section */}
          <div className="order-2 md:order-1">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Order Summary</h3>
            <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-gray-600 border-b pb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t flex justify-between items-center text-gray-800 font-bold text-xl">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Form Section */}
          <div className="order-1 md:order-2">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Shipping Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-blue-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-blue-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="text-blue-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

