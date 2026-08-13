/**
 * Unified Database Configuration
 * Merged from Admin-erp and faculty_student database connection patterns
 * PostgreSQL connection pool using pg library
 */

const { Pool } = require('pg');
const config = require('./index');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20,                          // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,         // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000,    // Return error if connection takes more than 5 seconds
});

// Log pool creation
if (config.env === 'development') {
  console.log('🔗 Database pool created:', {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
  });
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(1);
});

// Handle pool connect events (optional, for debugging)
pool.on('connect', () => {
  if (config.env === 'development') {
    console.log('✅ New client connected to database');
  }
});

// Handle pool remove events (optional, for debugging)
pool.on('remove', () => {
  if (config.env === 'development') {
    console.log('🔌 Client removed from pool');
  }
});

/**
 * Execute a query using the connection pool
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = (text, params) => pool.query(text, params);

/**
 * Get a client from the pool for transactions
 * Remember to call client.release() when done!
 * @returns {Promise} PostgreSQL client
 */
const getClient = () => pool.connect();

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Close all connections in the pool
 * Use this for graceful shutdown
 * @returns {Promise}
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('🔒 Database pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool:', error.message);
    throw error;
  }
};

// Export pool and utility functions
module.exports = {
  pool,           // Direct pool access (faculty_student pattern)
  query,          // Query helper (Admin-erp pattern)
  getClient,      // Get client for transactions
  testConnection, // Test database connection
  closePool,      // Graceful shutdown
};
