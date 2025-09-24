// In: Frontend/frontend/app/utils/api.ts

import axios from 'axios';

// Use the environment variable for the production URL, but fall back
// to the local backend URL for development.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create an Axios instance with the correct base URL
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches a paginated list of products.
 * @param page - The page number to retrieve.
 * @param limit - The number of items per page.
 * @returns A promise that resolves to the product data.
 */
export const fetchProducts = async (page: number, limit: number) => {
  const response = await api.get('/product', {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

/**
 * Fetches a single product by its ID.
 * @param productId - The ID of the product to retrieve.
 * @returns A promise that resolves to the product data.
 */
export const fetchProductById = async (productId: string) => {
  const response = await api.get(`/product/${productId}`);
  return response.data;
};

/**
 * Fetches the list of all categories.
 * @returns A promise that resolves to the category data.
 */
export const fetchCategories = async () => {
  const response = await api.get('/category');
  return response.data;
};

/**
 * Fetches navigation link data.
 * @returns A promise that resolves to the navigation data.
 */
export const fetchNavigation = async () => {
    const response = await api.get('/navigation');
    return response.data;
}