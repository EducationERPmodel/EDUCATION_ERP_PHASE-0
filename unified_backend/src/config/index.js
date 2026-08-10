/**
 * Unified Configuration
 * Merged from Admin-erp and faculty_student config patterns
 * Central configuration for all environment variables
 */

require('dotenv').config();

const config = {
  // Server configuration
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Upload/Storage configuration
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  
  // Database configuration
  // Supports both PG_* (Admin-erp) and DB_* (faculty_student) env variable patterns
  db: {
    host: process.env.PG_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || process.env.DB_PORT, 10) || 5432,
    database: process.env.PG_DATABASE || process.env.DB_NAME || 'education_erp',
    user: process.env.PG_USER || process.env.DB_USER || 'postgres',
    password: process.env.PG_PASSWORD || process.env.DB_PASSWORD || '',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'svce-erp-unified-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    enableFileLogging: process.env.ENABLE_FILE_LOGS === 'true',
  },
};

// Validate required environment variables in production
if (config.env === 'production') {
  const requiredEnvVars = [
    'JWT_SECRET',
    'PG_HOST',
    'PG_DATABASE',
    'PG_USER',
    'PG_PASSWORD',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
}

module.exports = config;
