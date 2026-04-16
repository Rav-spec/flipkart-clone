import React from 'react';

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="category-bar">
      <div className="container">
        <button
          className={`cat-chip ${!selected ? 'active' : ''}`}
          onClick={() => onSelect('')}
          id="cat-all"
        >
          <span className="cat-icon">🛍️</span>
          <span>All</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`cat-${cat.slug}`}
            className={`cat-chip ${selected === cat.slug ? 'active' : ''}`}
            onClick={() => onSelect(selected === cat.slug ? '' : cat.slug)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
