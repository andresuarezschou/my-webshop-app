
'use client';

import React from 'react';

// Define the props for the Confirmation component
interface ConfirmationProps {
  show: boolean;
  onClose: () => void;
  orderSummary: {
    fullName: string;
    email: string;
    total: number;
  };
}

/**
 * A modal component to confirm a successful order.
 * @param {ConfirmationProps} props The component props.
 * @returns {JSX.Element} The rendered confirmation modal.
 */
const Confirmation: React.FC<ConfirmationProps> = ({ show, onClose, orderSummary }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full m-4 text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Thank You!</h2>
          <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>
          <p className="text-sm text-gray-600"><strong>Name:</strong> {orderSummary.fullName}</p>
          <p className="text-sm text-gray-600"><strong>Email:</strong> {orderSummary.email}</p>
          <p className="text-lg font-bold text-gray-800 mt-2">Total: ${orderSummary.total.toFixed(2)}</p>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
