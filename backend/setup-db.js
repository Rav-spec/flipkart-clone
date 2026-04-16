/**
 * Flipkart Clone — Database Setup Script
 * Run: node setup-db.js
 *
 * This script reads your .env, connects to MySQL, and runs database.sql
 * to create the database, all tables, and seed data.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

async function setup() {
  console.log('\n🔧  Flipkart Clone — Database Setup');
  console.log('─────────────────────────────────────');

  let connection;
  try {
    // Connect WITHOUT specifying a database first
    connection = await mysql.createConnection({
      host:     DB_HOST     || 'localhost',
      port:     DB_PORT     || 3306,
      user:     DB_USER     || 'root',
      password: DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('✅  Connected to MySQL successfully\n');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split and run statement by statement to handle errors gracefully
    console.log('📦  Running database.sql ...\n');
    await connection.query(sql);

    console.log('✅  Database created:   flipkart_clone');
    console.log('✅  Tables created:     categories, products, cart, cart_items, orders, order_items');
    console.log('✅  Seed data loaded:   8 categories, 12 products\n');
    console.log('🚀  Setup complete! You can now run: npm run dev\n');

  } catch (err) {
    console.error('\n❌  Setup failed:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n👉  Fix: Update DB_PASSWORD in backend/.env with your MySQL root password');
      console.error('    Then re-run: node setup-db.js\n');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
