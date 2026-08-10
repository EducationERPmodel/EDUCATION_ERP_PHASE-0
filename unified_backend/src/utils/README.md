# Unified Utils

Utility functions merged from three ERP systems into a cohesive, reusable library.

## 📁 Structure

```
unified_backend/src/utils/
├── index.js              # Central export point
├── README.md             # This file
│
├── response.js           # ⚡ Unified response utilities
├── apiResponse.js        # 🔄 Backward compatibility for Admin-erp
│
├── asyncHandler.js       # Async error handling
├── jwt.js                # JWT token management
└── logger.js             # Winston logging
```

## 📦 Available Utilities

### 1. **Response Utilities** (`response.js`)

Merged from Admin-erp and education_erp response patterns.

#### `success(res, data, meta, statusCode)`
Admin-erp pattern - Simple success response
```javascript
const { success } = require('./utils/response');

success(res, { user: userData });
// { success: true, data: { user: {...} } }

success(res, users, { total: 100, page: 1 });
// { success: true, data: [...], meta: { total: 100, page: 1 } }
```

#### `successResponse(res, data, message, statusCode)`
education_erp pattern - Success with message and timestamp
```javascript
const { successResponse } = require('./utils/response');

successResponse(res, { user: userData }, 'User created successfully', 201);
// {
//   success: true,
//   message: 'User created successfully',
//   data: { user: {...} },
//   timestamp: '2026-08-06T14:51:00.000Z'
// }
```

#### `paginatedResponse(res, data, pagination, message)`
Paginated data response
```javascript
const { paginatedResponse } = require('./utils/response');

paginatedResponse(res, students, {
  page: 1,
  limit: 20,
  total: 150,
  totalPages: 8
}, 'Students fetched');
```

#### `errorResponse(res, message, statusCode, errors)`
Error response with optional validation errors
```javascript
const { errorResponse } = require('./utils/response');

errorResponse(res, 'Validation failed', 400, [
  { field: 'email', message: 'Invalid email format' }
]);
```

#### `ApiError` class
Custom error class with status code
```javascript
const { ApiError } = require('./utils/response');

throw new ApiError(404, 'User not found', { userId: 123 });
```

---

### 2. **Async Handler** (`asyncHandler.js`)

Wraps async route handlers to catch errors automatically.

```javascript
const asyncHandler = require('./utils/asyncHandler');

// Without asyncHandler (manual error handling)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// With asyncHandler (automatic error handling)
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

---

### 3. **JWT Utilities** (`jwt.js`)

JWT token generation, verification, and decoding.

#### `generateToken(user)`
Generate JWT token for authenticated user
```javascript
const { generateToken } = require('./utils/jwt');

// Admin user
const token = generateToken({
  id: 1,
  username: 'admin',
  role: 'admin'
});

// Faculty user (with roles)
const token = generateToken({
  employeeId: 'EMP001',
  username: 'faculty1',
  departmentCode: 'CS',
  coordinatorRoles: 'SPORTS,CULTURAL',
  designation: 'Assistant Professor'
});

// Faculty HOD
const token = generateToken({
  employeeId: 'EMP002',
  username: 'hod_cs',
  departmentCode: 'CS',
  designation: 'HOD, Computer Science'
});
```

#### `verifyToken(token)`
Verify and decode JWT token
```javascript
const { verifyToken } = require('./utils/jwt');

try {
  const payload = verifyToken(token);
  console.log(payload.username); // 'admin'
} catch (error) {
  console.error('Invalid token:', error.message);
}
```

#### `decodeToken(token)`
Decode without verification (for expired tokens)
```javascript
const { decodeToken } = require('./utils/jwt');

const payload = decodeToken(expiredToken);
console.log(payload); // { id: 1, username: 'admin', exp: ... }
```

#### `generateRefreshToken(user)`
Generate long-lived refresh token (7 days)
```javascript
const { generateRefreshToken } = require('./utils/jwt');

const refreshToken = generateRefreshToken(user);
```

---

### 4. **Logger Utilities** (`logger.js`)

Winston-based structured logging.

#### `logger` instance
```javascript
const { logger } = require('./utils/logger');

logger.info('Server started', { port: 3000 });
logger.debug('Database query', { query: 'SELECT * FROM users' });
logger.warn('High memory usage', { usage: '85%' });
logger.error('Database connection failed', { error: err.message });
```

#### `logRequest` middleware
Log HTTP requests
```javascript
const { logRequest } = require('./utils/logger');

app.use(logRequest);
// Logs: 2026-08-06 14:51:00 [info]: GET /api/users {"ip":"127.0.0.1","user":"admin"}
```

#### `logError` middleware
Log errors before error handler
```javascript
const { logError } = require('./utils/logger');

app.use(logError);
app.use((err, req, res, next) => {
  // Error already logged by logError
  res.status(500).json({ error: err.message });
});
```

---

## 🚀 Quick Start

### Import Individual Utilities
```javascript
const asyncHandler = require('./utils/asyncHandler');
const { success } = require('./utils/apiResponse');
const { generateToken } = require('./utils/jwt');
const { logger } = require('./utils/logger');
```

### Import All from Index
```javascript
const {
  asyncHandler,
  success,
  successResponse,
  ApiError,
  generateToken,
  verifyToken,
  logger,
} = require('./utils');
```

---

## 📋 Usage Examples

### Complete Controller Example
```javascript
const asyncHandler = require('../utils/asyncHandler');
const { success, ApiError } = require('../utils/response');
const { logger } = require('../utils/logger');
const userService = require('../services/userService');

// List users
const listUsers = asyncHandler(async (req, res) => {
  logger.info('Fetching users', { query: req.query });
  
  const { users, total } = await userService.getUsers(req.query);
  
  success(res, users, { total });
});

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  success(res, user);
});

// Create user
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  
  logger.info('User created', { userId: user.id });
  
  success(res, user, null, 201);
});

module.exports = { listUsers, getUser, createUser };
```

### Authentication Middleware Example
```javascript
const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (!token) {
      throw new ApiError(401, 'No token provided');
    }
    
    // Verify and decode token
    const payload = verifyToken(token);
    req.user = payload;
    
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = authenticate;
```

### Error Handler Middleware Example
```javascript
const { errorResponse, ApiError } = require('../utils/response');
const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  // Handle ApiError
  if (err instanceof ApiError) {
    return errorResponse(res, err.message, err.statusCode, err.details);
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed', 400, err.errors);
  }
  
  // Generic error
  errorResponse(res, 'Internal server error', 500);
};

module.exports = errorHandler;
```

---

## 🔧 Environment Variables

Required environment variables for JWT:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=8h
```

Optional for file logging:

```env
NODE_ENV=production
ENABLE_FILE_LOGS=true
```

---

## 🎯 Migration from Old Systems

### Admin-erp Pattern
```javascript
// Before (Admin-erp)
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

// After (Unified) - No change needed!
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
// OR
const { success } = require('../utils/response');
```

### education_erp Pattern
```javascript
// Before (education_erp)
const { successResponse, errorResponse } = require('../utils/response');
const { generateToken } = require('../utils/jwt');
const { logger } = require('../utils/logger');

// After (Unified) - No change needed!
const { successResponse, errorResponse } = require('../utils/response');
const { generateToken } = require('../utils/jwt');
const { logger } = require('../utils/logger');
```

### faculty_student Pattern
```javascript
// Before (faculty_student) - No utils folder
res.json(data);

// After (Unified) - Add response utilities
const { success } = require('../utils/response');
success(res, data);
```

---

## ✅ Best Practices

1. **Use `asyncHandler`** for all async route handlers
2. **Use `success()` or `successResponse()`** for consistent responses
3. **Throw `ApiError`** for expected errors
4. **Use `logger`** instead of `console.log`
5. **Verify tokens** in authentication middleware
6. **Log requests and errors** using middleware

---

## 📊 Utils Summary

| Utility | Source | Purpose |
|---------|--------|---------|
| `response.js` | Admin-erp + education_erp | Unified response formatting |
| `apiResponse.js` | Compatibility | Backward compatibility |
| `asyncHandler.js` | Admin-erp | Async error handling |
| `jwt.js` | education_erp | JWT token management |
| `logger.js` | education_erp | Structured logging |

---

**Status**: ✅ **COMPLETE**  
**Files**: 6 utility files  
**Systems Unified**: 3  
**Backward Compatible**: Yes
