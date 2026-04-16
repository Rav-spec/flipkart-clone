import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton skeleton-line lg" />
    <div className="skeleton skeleton-line md" />
    <div className="skeleton skeleton-line sm" style={{ marginBottom: '14px' }} />
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="product-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonGrid;
