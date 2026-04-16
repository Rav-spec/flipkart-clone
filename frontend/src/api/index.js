import axios from 'axios';

const API = axios.create({
  // In production: same origin so just use /api (relative)
  // In development: proxy to localhost:5000
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Products ─────────────────────────────────────────────────────────────────
export const fetchProducts = (params = {}) =>
  API.get('/products', { params });

export const fetchProductById = (id) =>
  API.get(`/products/${id}`);

// ── Categories ───────────────────────────────────────────────────────────────
export const fetchCategories = () =>
  API.get('/categories');

// ── Cart ──────────────────────────────────────────────────────────────────────
export const createCart = (sessionId) =>
  API.post('/cart', { sessionId });

export const fetchCart = (cartId) =>
  API.get(`/cart/${cartId}`);

export const addToCart = (cartId, productId, quantity = 1) =>
  API.post(`/cart/${cartId}/items`, { productId, quantity });

export const updateCartItem = (cartId, itemId, quantity) =>
  API.put(`/cart/${cartId}/items/${itemId}`, { quantity });

export const removeCartItem = (cartId, itemId) =>
  API.delete(`/cart/${cartId}/items/${itemId}`);

// ── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder = (cartId, address) =>
  API.post('/orders', { cartId, address });

export const fetchOrder = (orderId) =>
  API.get(`/orders/${orderId}`);

export const fetchOrderHistory = (orderIds) =>
  API.post('/orders/history', { orderIds });


export default API;
