import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, loading, updateItem, removeItem } = useCart();

  // Savings = sum of (original - discounted) * qty
  const savings = items.reduce(
    (sum, item) =>
      sum + (parseFloat(item.price) - parseFloat(item.discounted_price)) * item.quantity,
    0
  );

  const deliveryCharge = totalAmount > 499 ? 0 : 40;
  const finalTotal = totalAmount + deliveryCharge;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper container">
          <div className="spinner-wrap"><div className="spinner" /></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper container">
        <h1 className="cart-title">
          My Cart {totalItems > 0 && <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>({totalItems} item{totalItems !== 1 ? 's' : ''})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add items to your cart to get started</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', width: 'auto', padding: '12px 28px' }}>
              <FiShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items Panel */}
            <div className="cart-items-panel">
              {items.map((item) => (
                <div className="cart-item" key={item.cart_item_id} id={`cart-item-${item.cart_item_id}`}>
                  <img
                    src={item.thumbnail || 'https://via.placeholder.com/90x90?text=img'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/90x90?text=img'; }}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    style={{ cursor: 'pointer' }}
                  />

                  <div className="cart-item-info">
                    <h3
                      className="cart-item-name"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.name}
                    </h3>
                    {item.brand && <p className="cart-item-brand">{item.brand}</p>}

                    {/* Price */}
                    <div>
                      <span className="cart-item-price">{formatPrice(item.discounted_price)}</span>
                      {item.discount_percent > 0 && (
                        <>
                          <span className="cart-item-original">{formatPrice(item.price)}</span>
                          <span className="cart-item-discount">{Math.round(item.discount_percent)}% off</span>
                        </>
                      )}
                    </div>

                    {/* Quantity Control */}
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeItem(item.cart_item_id);
                          } else {
                            updateItem(item.cart_item_id, item.quantity - 1);
                          }
                        }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateItem(item.cart_item_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.cart_item_id)}
                      id={`remove-btn-${item.cart_item_id}`}
                    >
                      <FiTrash2 size={12} style={{ marginRight: '4px' }} />
                      Remove
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>
                      {formatPrice(item.discounted_price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Checkout Strip */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 40px' }} onClick={() => navigate('/checkout')} id="proceed-checkout-btn">
                  Place Order
                </button>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="cart-summary">
              <h3 className="summary-title">Price Details</h3>

              <div className="summary-row">
                <span>Price ({totalItems} items)</span>
                <span>{formatPrice(items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0))}</span>
              </div>

              <div className="summary-row">
                <span>Discount</span>
                <span style={{ color: 'var(--success)' }}>− {formatPrice(savings)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Charges</span>
                <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              {savings > 0 && (
                <div className="summary-savings">
                  🎉 You will save {formatPrice(savings)} on this order!
                </div>
              )}

              <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => navigate('/checkout')} id="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
