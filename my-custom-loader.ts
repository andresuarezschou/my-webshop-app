import { ImageLoaderProps } from 'next/image';

/**
 * A custom loader function for the Next.js Image component.
 * This is useful for when Next.js has issues with default remote patterns
 * or when you need more control over the image URL.
 * @param {ImageLoaderProps} param0
 * @returns {string} The full, absolute URL of the image.
 */
export default function myCustomLoader({ src }: ImageLoaderProps) {
  // Always prepend the full Strapi URL to the relative path from `src`.
  // The `src` we pass to <Image /> will now be just the image path, e.g., "/uploads/..."
  return `http://localhost:1337${src}`;
}
