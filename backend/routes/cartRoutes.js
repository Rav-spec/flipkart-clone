const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const cartController = require('../controllers/cartController');
const validate = require('../middleware/validate');

// POST /api/cart — create new cart
router.post('/', cartController.createCart);

// GET /api/cart/:cartId — get cart with items
router.get('/:cartId', cartController.getCart);

// POST /api/cart/:cartId/items — add item
router.post(
  '/:cartId/items',
  [
    body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  cartController.addToCart
);

// PUT /api/cart/:cartId/items/:itemId — update quantity
router.put(
  '/:cartId/items/:itemId',
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  cartController.updateCartItem
);

// DELETE /api/cart/:cartId/items/:itemId — remove item
router.delete('/:cartId/items/:itemId', cartController.removeFromCart);

module.exports = router;
