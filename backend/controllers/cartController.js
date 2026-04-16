const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const cartController = {
  /**
   * POST /api/cart
   * Creates a new cart and returns the cartId
   */
  createCart: async (req, res, next) => {
    try {
      const sessionId = req.body.sessionId || `session_${Date.now()}`;
      const cartId = await CartModel.create(sessionId);
      res.status(201).json({ success: true, data: { cartId } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/cart/:cartId
   * Returns cart items with product details + computed total
   */
  getCart: async (req, res, next) => {
    try {
      const { cartId } = req.params;

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const items = await CartModel.getCartWithItems(cartId);

      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price) * item.quantity,
        0
      );
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      res.json({
        success: true,
        data: {
          cartId,
          items,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          totalItems,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/cart/:cartId/items
   * Add a product to the cart
   */
  addToCart: async (req, res, next) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity = 1 } = req.body;

      // Validate cart exists
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      // Validate product exists and has stock
      const product = await ProductModel.getById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
      }

      await CartModel.addItem(cartId, productId, quantity);

      const items = await CartModel.getCartWithItems(cartId);
      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price) * item.quantity,
        0
      );

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: { items, totalAmount: parseFloat(totalAmount.toFixed(2)) },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/cart/:cartId/items/:itemId
   * Update quantity of a cart item
   */
  updateCartItem: async (req, res, next) => {
    try {
      const { cartId, itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
      }

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const updated = await CartModel.updateItemQuantity(itemId, quantity);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      const items = await CartModel.getCartWithItems(cartId);
      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price) * item.quantity,
        0
      );

      res.json({
        success: true,
        message: 'Cart updated',
        data: { items, totalAmount: parseFloat(totalAmount.toFixed(2)) },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/cart/:cartId/items/:itemId
   * Remove an item from cart
   */
  removeFromCart: async (req, res, next) => {
    try {
      const { cartId, itemId } = req.params;

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const removed = await CartModel.removeItem(itemId);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      const items = await CartModel.getCartWithItems(cartId);
      const totalAmount = items.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price) * item.quantity,
        0
      );

      res.json({
        success: true,
        message: 'Item removed from cart',
        data: { items, totalAmount: parseFloat(totalAmount.toFixed(2)) },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = cartController;
