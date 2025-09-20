import ProductList from './components/ProductList';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

// Define the types for the product
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

/**
 * Fetches product data from the Strapi API.
 * This is an async Server Component function.
 * @returns {Promise<Product[] | null>} A promise that resolves to an array of products or null.
 */
async function getProducts(): Promise<Product[] | null> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) {
    console.error("Strapi API token is missing. Please check your .env.local file.");
    return null;
  }

  try {
    const res = await fetch(`${STRAPI_API_URL}/api/products?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`API returned an error: ${res.status}`);
    }

    const response = await res.json();
    return response.data;

  } catch (error) {
    console.error("Failed to fetch products:", error);
    return null;
  }
}

/**
 * The main page component for the webshop.
 * It fetches the products and passes them to a client component.
 * @returns {JSX.Element} The rendered page component.
 */
export default async function Page() {
  const products = await getProducts();
  
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <main className="p-2">
        <h1>No Products Found</h1>
        <p>There might be an issue with the API, or no products have been added yet.</p>
        <p>Please check your Strapi admin panel.</p>
      </main>
    );
  }

  return <ProductList products={products} />;
}
