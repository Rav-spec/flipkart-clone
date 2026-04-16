import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { createCart, fetchCart, addToCart, updateCartItem, removeCartItem } from '../api';
import toast from 'react-hot-toast';

const CartContext = createContext();

const CART_ID_KEY = 'fk_cart_id';

const initialState = {
  cartId: null,
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        cartId: action.payload.cartId,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false,
      };
    case 'CLEAR_CART':
      return { ...state, items: [], totalAmount: 0, totalItems: 0 };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialise cart on mount
  useEffect(() => {
    initCart();
  }, []); // eslint-disable-line

  const initCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) {
        const res = await createCart(`session_${Date.now()}`);
        cartId = res.data.data.cartId;
        localStorage.setItem(CART_ID_KEY, cartId);
      }
      const res = await fetchCart(cartId);
      dispatch({ type: 'SET_CART', payload: { cartId, ...res.data.data } });
    } catch {
      // Create a fresh cart if stored one is invalid
      try {
        const res = await createCart(`session_${Date.now()}`);
        const cartId = res.data.data.cartId;
        localStorage.setItem(CART_ID_KEY, cartId);
        dispatch({ type: 'SET_CART', payload: { cartId, items: [], totalAmount: 0, totalItems: 0 } });
      } catch (e) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const refreshCart = useCallback(async (cartId) => {
    try {
      const res = await fetchCart(cartId || state.cartId);
      dispatch({ type: 'SET_CART', payload: { cartId: cartId || state.cartId, ...res.data.data } });
    } catch { /* silent */ }
  }, [state.cartId]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await addToCart(state.cartId, productId, quantity);
      dispatch({
        type: 'SET_CART',
        payload: {
          cartId: state.cartId,
          items: res.data.data.items,
          totalAmount: res.data.data.totalAmount,
          totalItems: res.data.data.items.reduce((s, i) => s + i.quantity, 0),
        },
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add item');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(state.cartId, itemId, quantity);
      dispatch({
        type: 'SET_CART',
        payload: {
          cartId: state.cartId,
          items: res.data.data.items,
          totalAmount: res.data.data.totalAmount,
          totalItems: res.data.data.items.reduce((s, i) => s + i.quantity, 0),
        },
      });
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await removeCartItem(state.cartId, itemId);
      dispatch({
        type: 'SET_CART',
        payload: {
          cartId: state.cartId,
          items: res.data.data.items,
          totalAmount: res.data.data.totalAmount,
          totalItems: res.data.data.items.reduce((s, i) => s + i.quantity, 0),
        },
      });
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, updateItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
