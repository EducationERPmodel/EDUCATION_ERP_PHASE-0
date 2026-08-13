/**
 * Unified Configuration
 * Merged from Admin-erp and faculty_student config patterns
 * Central configuration for all environment variables
 *
 * JWT_SECRET auto-generation:
 *   If JWT_SECRET is missing or is the placeholder value, a cryptographically
 *   random 64-byte hex secret is generated and written back into .env so it
 *   persists across restarts. Restarting the server will NOT invalidate tokens
 *   as long as .env is not deleted or reset.
 */

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
require('dotenv').config();

// ─── JWT Secret auto-generation ───────────────────────────────────────────────
const PLACEHOLDER = 'change-this-to-a-long-random-secret';
const ENV_PATH    = path.resolve(__dirname, '..', '..', '.env');

function ensureJwtSecret() {
  const current = process.env.JWT_SECRET;

  // Already set to a real value — nothing to do
  if (current && current !== PLACEHOLDER && current.length >= 32) {
    return current;
  }

  // Generate a strong random secret
  const generated = crypto.randomBytes(64).toString('hex');

  // Write it back into .env so it survives restarts
  try {
    if (fs.existsSync(ENV_PATH)) {
      let envContent = fs.readFileSync(ENV_PATH, 'utf8');

      if (envContent.includes('JWT_SECRET=')) {
        // Replace whatever is currently on that line
        envContent = envContent.replace(
          /^JWT_SECRET=.*$/m,
          `JWT_SECRET=${generated}`,
        );
      } else {
        // Append if the key doesn't exist at all
        envContent += `\nJWT_SECRET=${generated}\n`;
      }

      fs.writeFileSync(ENV_PATH, envContent, 'utf8');
      console.log('🔑  JWT_SECRET was not set — generated and saved to .env');
    } else {
      // No .env file at all — just use the generated value in-memory for this run
      console.warn('⚠️   No .env file found. JWT_SECRET generated for this session only.');
      console.warn('     Create a .env file from .env.example to persist it.');
    }
  } catch (err) {
    // File write failed (e.g. read-only FS in some CI environments) — use in-memory
    console.warn('⚠️   Could not write JWT_SECRET to .env:', err.message);
    console.warn('     Set JWT_SECRET manually in your environment.');
  }

  // Make it available to the rest of the process immediately
  process.env.JWT_SECRET = generated;
  return generated;
}

const jwtSecret = ensureJwtSecret();

// ─── Main config ──────────────────────────────────────────────────────────────

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
    host:     process.env.PG_HOST     || process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.PG_PORT || process.env.DB_PORT, 10) || 5432,
    database: process.env.PG_DATABASE || process.env.DB_NAME || 'education_erp',
    user:     process.env.PG_USER     || process.env.DB_USER || 'postgres',
    password: process.env.PG_PASSWORD || process.env.DB_PASSWORD || '',
  },

  // JWT configuration — secret is guaranteed to be a real value by this point
  jwt: {
    secret:    jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  // Logging configuration
  logging: {
    level:             process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    enableFileLogging: process.env.ENABLE_FILE_LOGS === 'true',
  },
};

// ─── Production guard ─────────────────────────────────────────────────────────
// JWT_SECRET is always present now (auto-generated above), so only check DB vars.
if (config.env === 'production') {
  const requiredEnvVars = ['PG_HOST', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
}

module.exports = config;
