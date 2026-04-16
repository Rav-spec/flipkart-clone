import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import SkeletonGrid from '../components/SkeletonGrid';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import { fetchProducts, fetchCategories } from '../api';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [fadeIn, setFadeIn]         = useState(false);
  const [search, setSearch]         = useState(searchParams.get('search') || '');
  const [category, setCategory]     = useState(searchParams.get('category') || '');

  // Track latest request to ignore stale responses
  const requestId = useRef(0);

  // Load categories once on mount
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  // Load products — only re-runs when search or category actually changes
  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setFadeIn(false);

    // Sync URL params
    const params = {};
    if (search)   params.search   = search;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });

    fetchProducts({ search, category, limit: 16 })
      .then((res) => {
        if (id !== requestId.current) return; // ignore stale response
        setProducts(res.data.data);
        setTotal(res.data.pagination.total);
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setProducts([]);
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
        // Small delay before fade-in so the grid is in the DOM first
        requestAnimationFrame(() => setFadeIn(true));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]); // ← only these two; no useCallback needed

  const handleSearch   = (q)    => setSearch(q);
  const handleCategory = (slug) => { setCategory(slug); setSearch(''); };

  const activeCat = categories.find((c) => c.slug === category);
  const showBanner = !search && !category;

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <CategoryFilter categories={categories} selected={category} onSelect={handleCategory} />

      {/* Hero Banner — kept mounted always to avoid layout shift; hidden via CSS */}
      <div style={{ display: showBanner ? 'block' : 'none' }}>
        <HeroBanner />
      </div>

      <div className="page-wrapper container">
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              {search
                ? `Results for "${search}"`
                : activeCat
                ? `${activeCat.icon} ${activeCat.name}`
                : '🔥 Popular Products'}
            </h2>
            {!loading && (
              <span className="results-count">
                {total} product{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try a different search term or category</p>
            </div>
          ) : (
            <div className={`product-grid${fadeIn ? ' products-visible' : ''}`}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
