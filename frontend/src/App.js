import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

import Home              from './pages/Home';
import ProductDetail     from './pages/ProductDetail';
import Cart              from './pages/Cart';
import Checkout          from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory      from './pages/OrderHistory';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,.12)',
            },
            success: { iconTheme: { primary: '#26a541', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ff6161', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/product/:id"    element={<ProductDetail />} />
          <Route path="/cart"           element={<Cart />} />
          <Route path="/checkout"       element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders"         element={<OrderHistory />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
