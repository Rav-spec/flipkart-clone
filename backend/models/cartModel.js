const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const CartModel = {
  /**
   * Create a new cart
   */
  create: async (sessionId) => {
    const id = uuidv4();
    await db.execute('INSERT INTO cart (id, session_id) VALUES (?, ?)', [id, sessionId]);
    return id;
  },

  /**
   * Find cart by ID
   */
  findById: async (cartId) => {
    const [rows] = await db.execute('SELECT * FROM cart WHERE id = ?', [cartId]);
    return rows[0] || null;
  },

  /**
   * Get cart with all its items + product info
   */
  getCartWithItems: async (cartId) => {
    const [items] = await db.execute(
      `SELECT
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.name,
        p.brand,
        p.price,
        p.discount_percent,
        p.discounted_price,
        p.stock,
        JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS thumbnail
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return items;
  },

  /**
   * Find a specific item in cart
   */
  findItem: async (cartId, productId) => {
    const [rows] = await db.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return rows[0] || null;
  },

  /**
   * Add item to cart
   */
  addItem: async (cartId, productId, quantity) => {
    await db.execute(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cartId, productId, quantity]
    );
  },

  /**
   * Update item quantity
   */
  updateItemQuantity: async (cartItemId, quantity) => {
    const [result] = await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Remove single item from cart
   */
  removeItem: async (cartItemId) => {
    const [result] = await db.execute(
      'DELETE FROM cart_items WHERE id = ?',
      [cartItemId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Clear all items in a cart (after order placed)
   */
  clearCart: async (cartId) => {
    await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  },
};

module.exports = CartModel;
