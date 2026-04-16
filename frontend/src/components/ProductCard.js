import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const thumbnail =
    product.thumbnail ||
    (Array.isArray(product.images) ? product.images[0] : null) ||
    'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
      id={`product-card-${product.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      <img
        src={thumbnail}
        alt={product.name}
        className="product-card-img"
        loading="lazy"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
      />

      <div className="product-card-body">
        {product.brand && (
          <span className="product-card-brand">{product.brand}</span>
        )}
        <h3 className="product-card-name">{product.name}</h3>

        {product.rating > 0 && (
          <div className="product-card-rating">
            <span className="rating-badge">
              {Number(product.rating).toFixed(1)} <FiStar size={10} />
            </span>
            <span className="rating-count">
              {Number(product.review_count).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        <div className="product-card-price">
          <span className="price-final">{formatPrice(product.discounted_price || product.price)}</span>
          {product.discount_percent > 0 && (
            <>
              <span className="price-original">{formatPrice(product.price)}</span>
              <span className="price-discount">{Math.round(product.discount_percent)}% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
