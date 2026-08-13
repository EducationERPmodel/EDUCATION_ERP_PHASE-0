# Unified Config

Configuration files merged from three ERP systems into a unified configuration structure.

## 📁 Structure

```
unified_backend/src/config/
├── index.js         # Central configuration (env variables)
├── db.js            # Database connection pool
└── README.md        # This file
```

## 📦 Available Configurations

### 1. **Central Config** (`index.js`)

All environment variables and application configuration in one place.

#### Configuration Object
```javascript
const config = require('./config');

console.log(config.port);          // 4000
console.log(config.env);           // 'development'
console.log(config.db.host);       // 'localhost'
console.log(config.jwt.secret);    // 'your-jwt-secret'
```

#### Available Settings

| Property | Env Variable | Default | Description |
|----------|-------------|---------|-------------|
| `port` | `PORT` | `4000` | Server port |
| `env` | `NODE_ENV` | `'development'` | Environment |
| `corsOrigin` | `CORS_ORIGIN` | `'*'` | CORS origin |
| `uploadDir` | `UPLOAD_DIR` | `'uploads'` | Upload directory |
| `db.host` | `PG_HOST` or `DB_HOST` | `'localhost'` | Database host |
| `db.port` | `PG_PORT` or `DB_PORT` | `5432` | Database port |
| `db.database` | `PG_DATABASE` or `DB_NAME` | `'svce_erp'` | Database name |
| `db.user` | `PG_USER` or `DB_USER` | `'postgres'` | Database user |
| `db.password` | `PG_PASSWORD` or `DB_PASSWORD` | `'postgres'` | Database password |
| `jwt.secret` | `JWT_SECRET` | `'...'` | JWT secret key |
| `jwt.expiresIn` | `JWT_EXPIRES_IN` | `'8h'` | JWT expiry |
| `logging.level` | `LOG_LEVEL` | `'debug'` | Log level |
| `logging.enableFileLogging` | `ENABLE_FILE_LOGS` | `false` | File logging |

---

### 2. **Database Config** (`db.js`)

PostgreSQL connection pool with utility functions.

#### Basic Usage
```javascript
const { pool, query } = require('./config/db');

// Method 1: Direct pool access (faculty_student pattern)
const result = await pool.query('SELECT * FROM students');
console.log(result.rows);

// Method 2: Query helper (Admin-erp pattern)
const result = await query('SELECT * FROM students WHERE id=$1', [123]);
console.log(result.rows);
```

#### Available Functions

##### `pool`
Direct access to PostgreSQL connection pool
```javascript
const { pool } = require('./config/db');

const result = await pool.query('SELECT * FROM users');
console.log(result.rows);
```

##### `query(text, params)`
Execute a query using the pool
```javascript
const { query } = require('./config/db');

const result = await query(
  'SELECT * FROM students WHERE semester=$1', 
  [5]
);
```

##### `getClient()`
Get a dedicated client for transactions
```javascript
const { getClient } = require('./config/db');

const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO students ...');
  await client.query('INSERT INTO attendance ...');
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

##### `testConnection()`
Test database connectivity
```javascript
const { testConnection } = require('./config/db');

const isConnected = await testConnection();
if (isConnected) {
  console.log('Database is ready!');
}
```

##### `closePool()`
Gracefully close all connections
```javascript
const { closePool } = require('./config/db');

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});
```

---

## 🚀 Quick Start

### Setup Environment Variables

Create a `.env` file in `unified_backend/`:

```env
# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN=*

# Database (use either PG_* or DB_* prefix)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=svce_erp
PG_USER=postgres
PG_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=8h

# Logging
LOG_LEVEL=debug
ENABLE_FILE_LOGS=false
```

### Import and Use

```javascript
// Import config
const config = require('./config');
const { pool, query, testConnection } = require('./config/db');

// Use config
console.log(`Server running on port ${config.port}`);

// Use database
const users = await query('SELECT * FROM users');
```

---

## 📋 Usage Examples

### Example 1: Basic Controller with Database
```javascript
const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');

exports.getStudents = asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM students ORDER BY usn');
  success(res, result.rows);
});
```

### Example 2: Transaction Example
```javascript
const { getClient } = require('../config/db');

async function transferStudent(studentId, newSection) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Update student section
    await client.query(
      'UPDATE students SET section=$1 WHERE id=$2',
      [newSection, studentId]
    );
    
    // Log the transfer
    await client.query(
      'INSERT INTO transfer_logs (student_id, new_section, transferred_at) VALUES ($1, $2, NOW())',
      [studentId, newSection]
    );
    
    await client.query('COMMIT');
    console.log('✅ Transfer successful');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Transfer failed:', err);
    throw err;
  } finally {
    client.release();
  }
}
```

### Example 3: Using Config in Server Setup
```javascript
const express = require('express');
const config = require('./config');
const { testConnection } = require('./config/db');

const app = express();

// Test database connection
testConnection().then(isConnected => {
  if (!isConnected) {
    console.error('❌ Cannot start server without database');
    process.exit(1);
  }
  
  // Start server
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📦 Environment: ${config.env}`);
    console.log(`🗄️  Database: ${config.db.database}`);
  });
});
```

### Example 4: Graceful Shutdown
```javascript
const { closePool } = require('./config/db');

// Handle graceful shutdown
const shutdown = async () => {
  console.log('⏹️  Shutting down...');
  await closePool();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

---

## 🔧 Environment Variable Support

### Dual Pattern Support

The config supports both naming patterns for backward compatibility:

| Admin-erp Pattern | faculty_student Pattern |
|-------------------|-------------------------|
| `PG_HOST` | `DB_HOST` |
| `PG_PORT` | `DB_PORT` |
| `PG_DATABASE` | `DB_NAME` |
| `PG_USER` | `DB_USER` |
| `PG_PASSWORD` | `DB_PASSWORD` |

You can use either pattern in your `.env` file!

---

## ✅ Migration from Old Systems

### Admin-erp Pattern
```javascript
// Before (Admin-erp)
const { pool, query, getClient } = require('../config/db');
const config = require('../config');

// After (Unified) - No change needed!
const { pool, query, getClient } = require('../config/db');
const config = require('../config');
```

### faculty_student Pattern
```javascript
// Before (faculty_student)
const pool = require('../config/db');

// After (Unified) - Works exactly the same!
const pool = require('../config/db').pool;
// OR
const { pool } = require('../config/db');
```

---

## 🛡️ Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** in production (minimum 32 characters)
3. **Use environment-specific configs** (dev, staging, production)
4. **Validate required vars** on startup (already built-in for production)
5. **Use connection pooling** (already configured with sensible defaults)

---

## 🔍 Debugging

### Enable Database Logging
```javascript
// In development, logs are automatically shown
// Check config/db.js for connection events

// Example output:
// 🔗 Database pool created: { host: 'localhost', port: 5432, ... }
// ✅ New client connected to database
// 🔌 Client removed from pool
```

### Test Database Connection
```javascript
const { testConnection } = require('./config/db');

// Test connection on startup
testConnection();
// Output: ✅ Database connection successful: 2026-08-06T15:04:00.000Z
```

---

## 📊 Pool Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `max` | `20` | Maximum clients in pool |
| `idleTimeoutMillis` | `30000` | Close idle clients after 30s |
| `connectionTimeoutMillis` | `5000` | Connection timeout |

---

## ✅ Status

**Config layer is complete and ready!**

- ✅ Central configuration (`index.js`)
- ✅ Database pool (`db.js`)
- ✅ Dual env variable support (PG_* and DB_*)
- ✅ Transaction support
- ✅ Graceful shutdown
- ✅ Connection testing
- ✅ Error handling
- ✅ Development logging

---

**Date**: August 6, 2026  
**Version**: 1.0.0  
**Systems Unified**: 3 (Admin-erp, faculty_student, education_erp)
