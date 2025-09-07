import Image from 'next/image'

async function getProducts() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  // If the token is not defined, we can't make the API call.
  if (!token) {
    console.error("Strapi API token is missing. Please check your .env.local file.");
    return null;
  }

  try {
    const res = await fetch('http://localhost:1337/api/products?populate=*', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Prevents Next.js from using a cached version of the data
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`API returned an error: ${res.status}`);
    }

    const response = await res.json();
    return response.data;

  } catch (error) {
    // Log the error to the console for debugging
    console.error("Failed to fetch products:", error);
    return null;
  }
}

/**
 * The main page component for the webshop.
 * It fetches the products and displays them in a list.
 * @returns {JSX.Element} The rendered page component.
 */
export default async function Page() {
  const products = await getProducts();

  // Check if products is a valid array with content before trying to map.
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <main>
        <h1>No Products Found</h1>
        <p>There might be an issue with the API, or no products have been added yet.</p>
        <p>Please check your Strapi admin panel.</p>
      </main>
    );
  }

  return (
    <main className="p-30">
      <h1 className="text-2xl py-10">Our Products</h1>
      <ul className="grid gap-10">
        
{products.map((product) => {
  // This is the correct way to get just the relative path.
  const imagePath = Array.isArray(product.image) && product.image[0] && product.image[0].url
    ? product.image[0].url
    : null;

  return (
    <li key={product.id}>
      <h2 className="text-2xl text-blue-600">{product.name}</h2>
      {imagePath && (
        <Image
          src={imagePath} // Pass the relative path only!
          alt={product.name || 'Product image'}
          width={200}
          height={200}
        />
     )}

            {/* This new section handles the description array.
              It maps over each object in the array and then maps over the nested
              'children' array to get the actual 'text' from each object.
              This will correctly render the description as a single string.
            */}
            <p>
              {Array.isArray(product.description) 
                ? product.description.map(block => block.children.map(child => child.text).join('')).join(' ')
                : product.description}
            </p>
            <p className="text-yellow-400">Price: ${product.price}</p>
          </li>
         );
        })}
      </ul>
    </main>
  );
}

