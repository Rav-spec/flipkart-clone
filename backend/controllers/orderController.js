const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');

const orderController = {
  /**
   * POST /api/orders
   */
  placeOrder: async (req, res, next) => {
    try {
      const { cartId, address } = req.body;

      const cart = await CartModel.findById(cartId);
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

      const items = await CartModel.getCartWithItems(cartId);
      if (!items || items.length === 0)
        return res.status(400).json({ success: false, message: 'Cart is empty' });

      for (const item of items) {
        if (item.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${item.name}". Only ${item.stock} available.`,
          });
        }
      }

      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price) * item.quantity, 0
      );

      const orderId = await OrderModel.create({
        cartId, address, items,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      });

      await CartModel.clearCart(cartId);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        data: { orderId },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/orders/:orderId
   */
  getOrderById: async (req, res, next) => {
    try {
      const order = await OrderModel.getById(req.params.orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/orders/history
   * Body: { orderIds: ['uuid1', 'uuid2', ...] }
   * Returns full detail for all passed order IDs (from client localStorage)
   */
  getOrderHistory: async (req, res, next) => {
    try {
      const { orderIds } = req.body;
      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const orders = await OrderModel.getByIds(orderIds.slice(0, 50)); // max 50
      res.json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = orderController;
