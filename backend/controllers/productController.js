const ProductModel = require('../models/productModel');

const productController = {
  /**
   * GET /api/products
   * Query params: search, category, limit, offset
   */
  getAllProducts: async (req, res, next) => {
    try {
      const { search = '', category = '', limit = 20, offset = 0 } = req.query;
      const filters = { search, categorySlug: category, limit, offset };

      // Run both queries in parallel — single round-trip each, but concurrent
      const [products, total] = await Promise.all([
        ProductModel.getAll(filters),
        ProductModel.count(filters),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/products/:id
   */
  getProductById: async (req, res, next) => {
    try {
      const product = await ProductModel.getById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Parse JSON fields stored as strings from MySQL
      if (typeof product.images === 'string') {
        try { product.images = JSON.parse(product.images); } catch { product.images = []; }
      }
      if (typeof product.specifications === 'string') {
        try { product.specifications = JSON.parse(product.specifications); } catch { product.specifications = {}; }
      }

      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = productController;
