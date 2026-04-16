const db = require('../config/db');

const CategoryModel = {
  /**
   * Get all categories
   */
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, name, slug, icon FROM categories ORDER BY name ASC'
    );
    return rows;
  },

  /**
   * Get category by slug
   */
  getBySlug: async (slug) => {
    const [rows] = await db.execute(
      'SELECT id, name, slug, icon FROM categories WHERE slug = ?',
      [slug]
    );
    return rows[0] || null;
  },
};

module.exports = CategoryModel;
