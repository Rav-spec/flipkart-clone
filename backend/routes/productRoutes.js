const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');

// GET /api/products?search=&category=&limit=&offset=
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be >= 0'),
  ],
  validate,
  productController.getAllProducts
);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
