
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  created_at: string;
  order_total: number;
  items_ordered: CartItem[];
}

interface OrderHistoryProps {
  show: boolean;
  onClose: () => void;
  userId: string | null;
}

/**
 * A modal component to display the order history for a specific user.
 * @param {OrderHistoryProps} props The component props.
 * @returns {JSX.Element | null} The rendered modal or null if not visible.
 */
export default function OrderHistory({ show, onClose, userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) {
        // If there's no user ID, we can't fetch anything.
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching order history:', error.message);
        setError('Failed to load order history. Please try again.');
        setLoading(false);
        return;
      }
      
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }
    
    // Only fetch orders if the modal is shown and a userId is available
    if (show && userId) {
      fetchOrders();
    }
  }, [show, userId]);

  if (!show) {
    return null;
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-blue-700 font-bold">Order History</h2>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          User ID: <span className="font-mono text-gray-700">{userId || 'Not signed in'}</span>
        </p>

        {loading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4">Loading your orders...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : orders.length > 0 ? (
          <ul className="space-y-6 max-h-96 overflow-y-auto">
            {orders.map(order => (
              <li key={order.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-600">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <ul className="space-y-2 mb-2">
                  {order.items_ordered.map((item: CartItem, index: number) => (
                    <li key={index} className="flex justify-between text-sm text-blue-700 border-b border-gray-200 pb-1">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-gray-700 flex justify-between items-center pt-2 border-t border-gray-300">
                  <p className="text-lg font-bold">Total:</p>
                  <p className="text-lg font-bold">${formatPrice(order.order_total)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-700 py-8">You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}
