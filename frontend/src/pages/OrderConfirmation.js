import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchOrder } from '../api';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ORDER_HISTORY_KEY = 'fk_order_ids';

// Save order ID to localStorage history
export const saveOrderToHistory = (orderId) => {
  try {
    const existing = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];
    if (!existing.includes(orderId)) {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify([orderId, ...existing]));
    }
  } catch { /* silent */ }
};

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persist order ID so it appears in Order History
    saveOrderToHistory(orderId);

    fetchOrder(orderId)
      .then((res) => setOrder(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);
  const formattedDate = estimatedDate.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Navbar />
      <div className="page-wrapper order-confirm-page">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="order-confirm-card">
            {/* Success Icon */}
            <div className="success-icon">✓</div>

            <h1>Order Confirmed! 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '8px' }}>
              Thank you{order ? `, ${order.full_name.split(' ')[0]}` : ''}! Your order has been placed successfully.
            </p>

            {/* Order ID */}
            <div className="order-id-box">
              Order ID: <strong>#{orderId}</strong>
            </div>

            {/* Delivery Note */}
            <div className="delivery-note">
              📦 Estimated Delivery by <strong>{formattedDate}</strong>
            </div>

            {/* Order Items */}
            {order && order.items && (
              <div className="order-summary-items">
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  Items Ordered
                </h4>
                {order.items.map((item, i) => (
                  <div key={i} className="confirm-item-row">
                    <span>{item.product_name} × {item.quantity}</span>
                    <strong>{formatPrice(item.total_price)}</strong>
                  </div>
                ))}
                <div className="confirm-total">
                  <span>Total Paid</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            )}

            {/* Address */}
            {order && (
              <div style={{ textAlign: 'left', marginTop: '16px', padding: '12px 16px', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                <div style={{ fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  📍 Delivery Address
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}<br />
                  {order.city}, {order.state} — {order.pincode}
                </div>
              </div>
            )}

            {order && (
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Payment: <strong>{order.payment_method === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}</strong>
                &nbsp;|&nbsp;Status: <strong style={{ color: 'var(--success)', textTransform: 'capitalize' }}>{order.status}</strong>
              </p>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>
                🛒 Continue Shopping
              </Link>
              <Link to="/orders" className="btn btn-outline" style={{ width: 'auto', padding: '12px 24px' }}>
                📋 View Order History
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderConfirmation;
