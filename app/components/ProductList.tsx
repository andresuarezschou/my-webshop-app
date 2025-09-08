'use client';

import Image from 'next/image';
import { useState } from 'react';
import Cart from './Cart';

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

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="p-30">
      <div className="flex justify-between items-center py-10">
        <h1 className="text-2xl">Our Products</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowCart(true)} className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2m7 0h3.5a1 1 0 010 2H9.25M3 3a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V3z" />
            </svg>
            <span className="text-lg">Cart ({totalItemsInCart})</span>
          </button>
        </div>
      </div>
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
                  src={`${STRAPI_API_URL}${productImageUrl}`}
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
      />
    </main>
  );
}

