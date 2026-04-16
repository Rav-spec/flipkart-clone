const CategoryModel = require('../models/categoryModel');

const categoryController = {
  /**
   * GET /api/categories
   */
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await CategoryModel.getAll();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
