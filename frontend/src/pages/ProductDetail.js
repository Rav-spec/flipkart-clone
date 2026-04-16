import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiZap, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { fetchProductById } from '../api';
import { useCart } from '../context/CartContext';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then((res) => {
        const p = res.data.data;
        if (typeof p.images === 'string') { try { p.images = JSON.parse(p.images); } catch { p.images = []; } }
        if (typeof p.specifications === 'string') { try { p.specifications = JSON.parse(p.specifications); } catch { p.specifications = {}; } }
        setProduct(p);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addItem(product.id, 1);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    setAdding(true);
    await addItem(product.id, 1);
    setAdding(false);
    navigate('/cart');
  };

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

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/500x500?text=No+Image'];

  const specs = product.specifications && typeof product.specifications === 'object'
    ? Object.entries(product.specifications)
    : [];

  const inStock = product.stock > 0;

  return (
    <>
      <Navbar />
      <div className="page-wrapper container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/?category=${product.category_slug}`}>{product.category_name}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="active">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* ─── Left: Image Carousel ─── */}
          <div className="image-carousel">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="carousel-main"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
            />
            {images.length > 1 && (
              <div className="carousel-thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`carousel-thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=img'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Product Info ─── */}
          <div className="product-info-panel">
            {/* Main Info Card */}
            <div className="product-info-card">
              {product.brand && (
                <div className="product-brand-badge">{product.brand}</div>
              )}
              <h1>{product.name}</h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="product-rating-row">
                  <span className="detail-rating-badge">
                    {Number(product.rating).toFixed(1)} <FiStar size={12} />
                  </span>
                  <span className="detail-review-count">
                    {Number(product.review_count).toLocaleString('en-IN')} Ratings
                  </span>
                </div>
              )}

              {/* Price Block */}
              <div className="product-price-block" style={{ margin: '16px 0' }}>
                <span className="final-price">{formatPrice(product.discounted_price || product.price)}</span>
                {product.discount_percent > 0 && (
                  <>
                    <span className="original-price">{formatPrice(product.price)}</span>
                    <span className="discount-label">{Math.round(product.discount_percent)}% off</span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {inStock ? (
                  <span className="stock-badge in-stock">
                    <FiCheckCircle size={14} /> In Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="stock-badge out-of-stock">
                    <FiXCircle size={14} /> Out of Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="product-actions" style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-cart"
                  onClick={handleAddToCart}
                  disabled={!inStock || adding}
                  id="add-to-cart-btn"
                >
                  <FiShoppingCart size={18} />
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  className="btn btn-buy"
                  onClick={handleBuyNow}
                  disabled={!inStock || adding}
                  id="buy-now-btn"
                >
                  <FiZap size={18} />
                  Buy Now
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Description
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Specifications Card */}
            {specs.length > 0 && (
              <div className="product-info-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                  Specifications
                </h3>
                <table className="specs-table">
                  <tbody>
                    {specs.map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
