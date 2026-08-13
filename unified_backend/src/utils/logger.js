/**
 * Winston Logger Utility
 * From education_erp
 * 
 * Provides structured logging with different levels (debug, info, warn, error)
 * Logs to console with colorization and optional file output
 */

const winston = require('winston');
const path = require('path');

// Create logs directory path
const logDir = path.join(__dirname, '..', '..', 'logs');

/**
 * Winston logger instance
 * Level: debug in development, info in production
 * Format: JSON with timestamp and error stack traces
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'unified-erp' },
  transports: [
    // Console output with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length && meta.service !== 'unified-erp' 
            ? JSON.stringify(meta) 
            : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    }),
  ],
});

/**
 * Optional: Add file transports for production
 * Uncomment to enable file logging
 */
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_FILE_LOGS === 'true') {
  logger.add(
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

/**
 * Log HTTP requests middleware
 */
const logRequest = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    user: req.user?.username || 'anonymous',
  });
  next();
};

/**
 * Log errors middleware
 */
const logError = (err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });
  next(err);
};

module.exports = { 
  logger,
  logRequest,
  logError,
};
