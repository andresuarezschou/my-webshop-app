
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Cart from './Cart';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import OrderHistory from './OrderHistory';
import { supabase } from '../../lib/supabaseClient';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

// Define the types for the product and cart items
interface DescriptionTextChild {
  type: string;
  text: string;
}

interface DescriptionBlock {
  type: string;
  children: DescriptionTextChild[];
}

interface Product {
  id: number;
  attributes?: {
    name: string;
    description: DescriptionBlock[];
    price: number;
    image: {
      data?: {
        attributes?: {
          url: string;
        };
      }[];
    };
  };
  name?: string;
  description?: DescriptionBlock[];
  price?: number;
  image?: { url: string }[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductListProps {
  products: Product[];
}

/**
 * A client component to display the products and manage the shopping cart.
 * @param {ProductListProps} props The component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function ProductList({ products }: ProductListProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [orderSummary, setOrderSummary] = useState({ fullName: '', email: '', total: 0 });
  const [userId, setUserId] = useState<string | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState<boolean>(false);

  useEffect(() => {
    // This listener ensures we always have the current user's ID
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we have a session, use that user's ID.
      if (session) {
        setUserId(session.user.id);
      } else {
        // Otherwise, sign in anonymously to create one.
        // This is a one-time operation per session that gives us a temporary user ID.
        supabase.auth.signInAnonymously().then(({ data, error }) => {
          if (error) {
            console.error('Error signing in anonymously:', error.message);
          }
          if (data?.user) {
            setUserId(data.user.id);
          }
        });
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addToCart = (product: Product) => {
    const productName = product.attributes?.name || product.name;
    const productPrice = product.attributes?.price || product.price;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: productName as string,
          price: productPrice as number,
          quantity: 1,
        }];
      }
    });
  };

  const removeOneFromCart = (itemId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter(item => item.id !== itemId);
      }
    });
  };
    
  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleConfirmOrder = async (summary: { fullName: string; email: string; total: number }) => {
    setShowCheckout(false);

    // Get the current session to ensure the user is authenticated just before inserting.
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const { error } = await supabase
        .from('orders')
        .insert([{
          user_id: session.user.id,
          order_total: summary.total,
          items_ordered: cartItems,
        }]);

      if (error) {
        console.error('Error saving order to database:', error.message);
      }
    } else {
      console.error('User not authenticated. Order not saved.');
    }
    
    clearCart();
    setOrderSummary(summary);
    setShowConfirmation(true);
  };
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <main className="p-4 sm:p-8 md:p-12 lg:p-20">
      <div className="flex justify-between items-center py-10">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowOrderHistory(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Order History
          </button>
          <button onClick={() => setShowCart(true)} className="flex items-center space-x-2">
            <span className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Cart ({totalItemsInCart})</span>
          </button>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
      <h1 className="text-2xl py-5">Our Products</h1>
      <ul className="grid gap-10">
        {products.map((product: Product) => {
          const productName = product.attributes?.name || product.name;
          const productDescription = product.attributes?.description || product.description;
          const productPrice = product.attributes?.price || product.price;
          const productImageUrl = product.attributes?.image?.data?.[0]?.attributes?.url || (product.image && product.image[0]?.url);

          return (
            <li key={product.id}>
              <h2 className="text-2xl text-blue-600">{productName}</h2>
              {productImageUrl && (
                <Image
                  src={productImageUrl}
                  alt={productName || 'Product image'}
                  width={200}
                  height={200}
                  unoptimized={true}
                />
              )}
              <p>
                {Array.isArray(productDescription)
                  ? productDescription.map((block: DescriptionBlock) => block.children.map((child: DescriptionTextChild) => child.text).join('')).join(' ')
                  : productDescription}
              </p>
              <p className="text-yellow-400">Price: ${productPrice}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </li>
          );
        })}
      </ul>
      <Cart
        cartItems={cartItems}
        show={showCart}
        onClose={() => setShowCart(false)}
        onRemove={removeOneFromCart}
        onCheckout={handleCheckout}
      />
      <Checkout
        cartItems={cartItems}
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
        onConfirmOrder={handleConfirmOrder}
      />
      {/* Render the Confirmation modal */}
      <Confirmation
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderSummary={orderSummary}
      />
      {/* NEW: Render the OrderHistory modal */}
      <OrderHistory
        show={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
        userId={userId}
      />
    </main>
  );
}
