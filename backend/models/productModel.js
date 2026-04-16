const db = require('../config/db');
const mysql = require('mysql2');

const ProductModel = {
  /**
   * Get all products with optional search and category filter.
   * Uses db.query() (non-prepared) for LIMIT/OFFSET — required for MySQL 9 compatibility.
   */
  getAll: async ({ search = '', categorySlug = '', limit = 50, offset = 0 }) => {
    const safeLimit  = parseInt(limit,  10) || 50;
    const safeOffset = parseInt(offset, 10) || 0;

    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (p.name LIKE ? OR p.brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categorySlug) {
      where += ' AND c.slug = ?';
      params.push(categorySlug);
    }

    // Inline LIMIT/OFFSET as safe integers (not bound params) for MySQL 9
    const sql = `
      SELECT
        p.id, p.name, p.brand, p.price, p.discount_percent, p.discounted_price,
        p.stock, p.rating, p.review_count,
        JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS thumbnail,
        c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;

    const [rows] = await db.query(sql, params);
    return rows;
  },

  /**
   * Count total matching products for pagination.
   */
  count: async ({ search = '', categorySlug = '' }) => {
    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (p.name LIKE ? OR p.brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categorySlug) {
      where += ' AND c.slug = ?';
      params.push(categorySlug);
    }

    const sql = `
      SELECT COUNT(*) AS total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${where}
    `;

    const [[{ total }]] = await db.query(sql, params);
    return total;
  },

  /**
   * Get single product by ID with full details.
   */
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT
        p.*,
        c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [parseInt(id, 10)]
    );
    return rows[0] || null;
  },
};

module.exports = ProductModel;
