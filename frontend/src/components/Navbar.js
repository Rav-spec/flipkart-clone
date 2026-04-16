import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) { onSearch(query); return; }
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="logo-text">Flipkart</span>
          <span className="logo-tagline">Explore <span>Plus</span> ✦</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="navbar-search-input"
            />
            <button type="submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Orders */}
          <Link to="/orders" className="nav-btn" id="orders-nav-btn" title="My Orders">
            <FiPackage size={17} />
            <span>Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-btn" id="cart-nav-btn" title="My Cart">
            <FiShoppingCart size={18} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems > 9 ? '9+' : totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
