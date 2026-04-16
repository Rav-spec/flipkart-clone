import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';
import toast from 'react-hot-toast';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const initialForm = {
  fullName: '', email: '', phone: '',
  addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '',
  paymentMethod: 'cod',
};

// ─────────────────────────────────────────────────────────────────────────────
// Field is defined OUTSIDE Checkout so React never unmounts/remounts it on
// re-render — this is what caused the "cursor disappears after each key" bug.
// ─────────────────────────────────────────────────────────────────────────────
const Field = ({ id, label, field, placeholder, type = 'text', fullWidth = false, form, errors, onChange }) => (
  <div className={`form-group${fullWidth ? ' full-width' : ''}`}>
    <label className="form-label" htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`form-input${errors[field] ? ' error' : ''}`}
      value={form[field]}
      onChange={onChange(field)}
      autoComplete="off"
    />
    {errors[field] && <span className="form-error">{errors[field]}</span>}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartId, totalAmount, totalItems, clearCart } = useCart();
  const [form, setForm]         = useState(initialForm);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper container">
          <div className="empty-state">
            <span className="empty-state-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', width: 'auto', padding: '12px 28px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  const delivery   = totalAmount > 499 ? 0 : 40;
  const grandTotal = totalAmount + delivery;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    return e;
  };

  // Stable handler — creates a new function per field name, not per render
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await placeOrder(cartId, {
        fullName:      form.fullName,
        email:         form.email,
        phone:         form.phone,
        addressLine1:  form.addressLine1,
        addressLine2:  form.addressLine2,
        city:          form.city,
        state:         form.state,
        pincode:       form.pincode,
        paymentMethod: form.paymentMethod,
      });
      const orderId = res.data.data.orderId;
      clearCart();
      navigate(`/order/${orderId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Shared props passed down to every Field
  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <>
      <Navbar />
      <div className="page-wrapper container">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link> <span className="breadcrumb-sep">›</span>
          <Link to="/cart">Cart</Link> <span className="breadcrumb-sep">›</span>
          <span className="active">Checkout</span>
        </nav>

        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-layout">

            {/* ─── Address Form ─── */}
            <div className="checkout-form-card">
              <h2>Delivery Address</h2>
              <div className="form-grid">
                <Field id="fullName"     label="Full Name"                   field="fullName"     placeholder="Rahul Sharma"              {...fieldProps} />
                <Field id="email"        label="Email"                        field="email"        placeholder="rahul@email.com" type="email" {...fieldProps} />
                <Field id="phone"        label="Phone"                        field="phone"        placeholder="9876543210"     type="tel"   {...fieldProps} />
                <Field id="pincode"      label="Pincode"                      field="pincode"      placeholder="400001"                     {...fieldProps} />
                <Field id="addressLine1" label="Address Line 1"               field="addressLine1" placeholder="Flat / House No., Building" fullWidth {...fieldProps} />
                <Field id="addressLine2" label="Address Line 2 (Optional)"    field="addressLine2" placeholder="Street, Area, Landmark"     fullWidth {...fieldProps} />
                <Field id="city"         label="City"                         field="city"         placeholder="Mumbai"                     {...fieldProps} />

                {/* State dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="state">State</label>
                  <select
                    id="state"
                    className={`form-select${errors.state ? ' error' : ''}`}
                    value={form.state}
                    onChange={handleChange('state')}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginTop: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-primary)' }}>
                  Payment Method
                </h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio" name="payment" value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={handleChange('paymentMethod')}
                    />
                    <div>
                      <div className="payment-option-label">💵 Cash on Delivery</div>
                      <div className="payment-option-desc">Pay when your order arrives</div>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio" name="payment" value="online"
                      checked={form.paymentMethod === 'online'}
                      onChange={handleChange('paymentMethod')}
                    />
                    <div>
                      <div className="payment-option-label">💳 Online Payment</div>
                      <div className="payment-option-desc">UPI, Cards, Net Banking</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ─── Order Summary ─── */}
            <div>
              <div className="cart-summary" style={{ marginBottom: '16px' }}>
                <h3 className="summary-title">Order Summary</h3>
                {items.map((item) => (
                  <div
                    key={item.cart_item_id}
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}
                  >
                    <span style={{ color: 'var(--text-secondary)', flex: 1, marginRight: '8px' }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      {formatPrice(item.discounted_price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
                  <div className="summary-row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span style={{ color: delivery === 0 ? 'var(--success)' : 'inherit' }}>
                      {delivery === 0 ? 'FREE' : formatPrice(delivery)}
                    </span>
                  </div>
                  <div className="summary-row total" style={{ marginTop: '8px' }}>
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                id="place-order-btn"
                style={{ fontSize: '16px', padding: '15px' }}
              >
                {submitting ? '⏳ Placing Order...' : '🛡️ Place Order'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
