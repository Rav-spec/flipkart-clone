import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { fetchOrderHistory } from '../api';

const ORDER_HISTORY_KEY = 'fk_order_ids';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_COLOR = {
  confirmed: '#2874f0',
  pending:   '#ff9f00',
  shipped:   '#9c27b0',
  delivered: '#26a541',
  cancelled: '#ff6161',
};

const OrderHistory = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');
    if (ids.length === 0) { setLoading(false); return; }

    fetchOrderHistory(ids)
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <Navbar />
      <div className="page-wrapper container">
        <h1 className="cart-title">
          My Orders{' '}
          {orders.length > 0 && (
            <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({orders.length})
            </span>
          )}
        </h1>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon"><FiPackage size={60} /></span>
            <h3>No orders yet</h3>
            <p>Place your first order to see it here</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', width: 'auto', padding: '12px 28px' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="cart-items-panel"
                style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px', background: '#fafafa', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', flexWrap: 'wrap', gap: '8px',
                  }}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Order ID
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, wordBreak: 'break-all' }}>
                      #{order.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{formatDate(order.created_at)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{formatPrice(order.total_amount)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                      <div style={{
                        fontSize: '12px', fontWeight: 700, textTransform: 'capitalize',
                        color: STATUS_COLOR[order.status] || 'var(--text-primary)',
                        background: `${STATUS_COLOR[order.status]}15`,
                        padding: '2px 10px', borderRadius: '20px', display: 'inline-block',
                      }}>
                        {order.status}
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {expanded[order.id] ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Expanded Items */}
                {expanded[order.id] && (
                  <div style={{ padding: '16px 20px' }}>
                    {/* Delivery address */}
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      📍 <strong>{order.full_name}</strong> — {order.city}, {order.state}
                      &nbsp;|&nbsp; {order.payment_method === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                    </div>

                    {/* Items */}
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '10px 0', borderBottom: '1px dashed var(--border)',
                      }}>
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            style={{ width: 52, height: 52, objectFit: 'contain', background: '#f5f5f5', padding: 4, borderRadius: 4, flexShrink: 0 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} × {formatPrice(item.unit_price)}
                          </div>
                        </div>
                        <strong style={{ fontSize: '14px' }}>{formatPrice(item.total_price)}</strong>
                      </div>
                    ))}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                      <Link
                        to={`/order/${order.id}`}
                        style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        View Full Details →
                      </Link>
                      <strong>{formatPrice(order.total_amount)}</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
