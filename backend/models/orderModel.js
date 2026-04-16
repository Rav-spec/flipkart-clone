const db = require('../config/db');

const OrderModel = {
  /**
   * Create a new order with its line items (transactional)
   */
  create: async ({ cartId, address, items, totalAmount }) => {
    const { v4: uuidv4 } = require('uuid');
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const orderId = uuidv4();

      await connection.execute(
        `INSERT INTO orders
           (id, cart_id, full_name, email, phone, address_line1, address_line2, city, state, pincode, total_amount, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, cartId || null,
          address.fullName, address.email, address.phone,
          address.addressLine1, address.addressLine2 || null,
          address.city, address.state, address.pincode,
          totalAmount, address.paymentMethod || 'cod',
        ]
      );

      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId, item.product_id, item.name,
            item.thumbnail || null, item.quantity,
            item.discounted_price,
            parseFloat((item.discounted_price * item.quantity).toFixed(2)),
          ]
        );
      }

      await connection.commit();
      return orderId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Get order by ID with all items
   */
  getById: async (orderId) => {
    const [orders] = await db.query(
      `SELECT id, full_name, email, phone,
              address_line1, address_line2, city, state, pincode,
              total_amount, status, payment_method, created_at
       FROM orders WHERE id = ?`,
      [orderId]
    );
    if (!orders[0]) return null;

    const [items] = await db.query(
      `SELECT product_id, product_name, product_image, quantity, unit_price, total_price
       FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return { ...orders[0], items };
  },

  /**
   * Get multiple orders by list of IDs (for order history)
   */
  getByIds: async (orderIds) => {
    if (!orderIds || orderIds.length === 0) return [];

    const placeholders = orderIds.map(() => '?').join(',');
    const [orders] = await db.query(
      `SELECT id, full_name, total_amount, status, payment_method, created_at,
              city, state
       FROM orders
       WHERE id IN (${placeholders})
       ORDER BY created_at DESC`,
      orderIds
    );

    // Fetch items count per order
    const result = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.query(
          'SELECT product_name, quantity, unit_price, total_price, product_image FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return { ...order, items };
      })
    );

    return result;
  },
};

module.exports = OrderModel;
