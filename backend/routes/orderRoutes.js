const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const validate = require('../middleware/validate');

// POST /api/orders — place order
router.post(
  '/',
  [
    body('cartId').notEmpty().withMessage('Cart ID is required'),
    body('address.fullName').notEmpty().withMessage('Full name is required'),
    body('address.email').isEmail().withMessage('Valid email is required'),
    body('address.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian phone number required'),
    body('address.addressLine1').notEmpty().withMessage('Address line 1 is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'),
    body('address.paymentMethod').optional().isIn(['cod', 'online']).withMessage('Payment method must be cod or online'),
  ],
  validate,
  orderController.placeOrder
);

// POST /api/orders/history — get multiple orders by IDs (order history)
router.post('/history', orderController.getOrderHistory);

// GET /api/orders/:orderId — get single order
router.get('/:orderId', orderController.getOrderById);

module.exports = router;
