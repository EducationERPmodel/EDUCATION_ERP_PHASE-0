# Unified Middleware

Middleware functions merged from three ERP systems into a unified, cohesive middleware layer.

## 📁 Structure

```
unified_backend/src/middleware/
├── index.js            # Central export point
├── authenticate.js     # ⚡ Authentication & authorization
├── errorHandler.js     # ⚡ Error handling
├── validate.js         # ⚡ Request validation
├── upload.js           # ⚡ File upload handling
└── README.md           # This file
```

## 📦 Available Middleware

### 1. **Authentication** (`authenticate.js`)

JWT-based authentication and role-based authorization.

#### `authenticate`
Main authentication middleware - verifies JWT from header or cookie
```javascript
const { authenticate } = require('./middleware/authenticate');

// Protect route
router.get('/profile', authenticate, getProfile);

// Supports both patterns:
// Authorization: Bearer <token>
// Cookie: token=<token>
```

#### `requireHOD`
Requires HOD role
```javascript
const { authenticate, requireHOD } = require('./middleware/authenticate');

router.get('/hod/dashboard', authenticate, requireHOD, getHODDashboard);
```

#### `requireRole(...roles)`
Requires specific role(s)
```javascript
const { authenticate, requireRole } = require('./middleware/authenticate');

// Single role
router.post('/events', authenticate, requireRole('CULTURAL'), createEvent);

// Multiple roles (any one)
router.post('/activities', 
  authenticate, 
  requireRole('SPORTS', 'CULTURAL', 'TECHNICAL'), 
  createActivity
);
```

#### `requireAdmin`
Requires admin role
```javascript
const { authenticate, requireAdmin } = require('./middleware/authenticate');

router.delete('/users/:id', authenticate, requireAdmin, deleteUser);
```

#### `requireSameDepartment`
Ensures same department access
```javascript
const { authenticate, requireSameDepartment } = require('./middleware/authenticate');

router.get('/faculty/:id', authenticate, requireSameDepartment, getFaculty);
// Route handler should set: req.targetDepartmentCode = faculty.departmentCode
```

#### `optionalAuth`
Optional authentication (doesn't fail if no token)
```javascript
const { optionalAuth } = require('./middleware/authenticate');

// Different response for authenticated vs unauthenticated users
router.get('/public/data', optionalAuth, getData);
```

---

### 2. **Error Handler** (`errorHandler.js`)

Centralized error handling for all application errors.

#### `notFound`
404 handler - place after all routes
```javascript
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Define all routes first
app.use('/api', routes);

// Then 404 handler
app.use(notFound);

// Then error handler
app.use(errorHandler);
```

#### `errorHandler`
Global error handler - handles all errors
```javascript
// Automatically handles:
// - ApiError with statusCode
// - PostgreSQL errors (unique, foreign key, etc.)
// - Prisma errors
// - JWT errors
// - Multer errors (file upload)
// - Validation errors

// Just throw errors in your code:
throw new ApiError(404, 'User not found');
```

#### `catchAsync`
Async error wrapper (alternative to asyncHandler)
```javascript
const { catchAsync } = require('./middleware/errorHandler');

router.get('/users', catchAsync(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

---

### 3. **Validation** (`validate.js`)

Request validation using express-validator.

#### `validate(validations)`
Admin-erp pattern - takes validation chains
```javascript
const { validate } = require('./middleware/validate');
const { body, param } = require('express-validator');

router.post('/users', 
  validate([
    body('email').isEmail().withMessage('Invalid email'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  createUser
);
```

#### `checkValidation`
education_erp pattern - inline validations
```javascript
const { checkValidation } = require('./middleware/validate');
const { body } = require('express-validator');

router.post('/users',
  body('email').isEmail(),
  body('name').notEmpty(),
  checkValidation,
  createUser
);
```

#### `sanitize(allowedFields)`
Remove unwanted fields from request body
```javascript
const { sanitize } = require('./middleware/validate');

router.put('/users/:id',
  authenticate,
  sanitize(['name', 'email', 'phone']), // Only allow these fields
  updateUser
);
```

#### `validatePagination`
Validate pagination parameters
```javascript
const { validatePagination } = require('./middleware/validate');

router.get('/users', validatePagination, getUsers);
// Adds req.pagination = { page, limit, offset }
```

#### `validateId`
Validate ID parameter
```javascript
const { validateId } = require('./middleware/validate');

router.get('/users/:id', validateId, getUser);
// Ensures req.params.id is a valid number
```

---

### 4. **File Upload** (`upload.js`)

File upload handling using multer.

#### `uploadPhoto`
Upload photos (images only)
```javascript
const { uploadPhoto } = require('./middleware/upload');

// Single photo
router.post('/profile/photo', 
  authenticate, 
  uploadPhoto.single('photo'), 
  uploadProfilePhoto
);

// Multiple photos
router.post('/gallery', 
  authenticate, 
  uploadPhoto.array('photos', 5), 
  uploadGalleryPhotos
);
```

#### `uploadDocument`
Upload documents (PDF, DOC, etc.)
```javascript
const { uploadDocument } = require('./middleware/upload');

router.post('/documents', 
  authenticate, 
  uploadDocument.single('document'), 
  uploadDocument
);
```

#### `uploadAny`
Upload any file type (use with caution)
```javascript
const { uploadAny } = require('./middleware/upload');

router.post('/files', 
  authenticate, 
  requireAdmin,
  uploadAny.single('file'), 
  uploadFile
);
```

#### `deleteUploadedFile(filepath)`
Delete uploaded file
```javascript
const { deleteUploadedFile } = require('./middleware/upload');

await deleteUploadedFile('photos/photo_123.jpg');
```

#### `getUploadUrl(filepath)`
Get full URL for uploaded file
```javascript
const { getUploadUrl } = require('./middleware/upload');

const url = getUploadUrl('photos/photo_123.jpg');
// Returns: http://localhost:4000/uploads/photos/photo_123.jpg
```

---

## 🚀 Quick Start

### Complete Route Example

```javascript
const express = require('express');
const { body } = require('express-validator');
const {
  authenticate,
  requireAdmin,
  validate,
  validatePagination,
  validateId,
  uploadPhoto,
} = require('./middleware');
const userController = require('./controllers/userController');

const router = express.Router();

// List users (with pagination)
router.get('/users', 
  authenticate,
  validatePagination, 
  userController.list
);

// Get user by ID
router.get('/users/:id', 
  authenticate,
  validateId,
  userController.getById
);

// Create user (with validation)
router.post('/users',
  authenticate,
  requireAdmin,
  validate([
    body('email').isEmail(),
    body('name').notEmpty(),
    body('password').isLength({ min: 6 }),
  ]),
  userController.create
);

// Update user
router.put('/users/:id',
  authenticate,
  validateId,
  validate([
    body('email').optional().isEmail(),
    body('name').optional().notEmpty(),
  ]),
  userController.update
);

// Upload profile photo
router.post('/users/:id/photo',
  authenticate,
  validateId,
  uploadPhoto.single('photo'),
  userController.uploadPhoto
);

// Delete user (admin only)
router.delete('/users/:id',
  authenticate,
  requireAdmin,
  validateId,
  userController.delete
);

module.exports = router;
```

### Complete App Setup

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config');
const { notFound, errorHandler } = require('./middleware');
const routes = require('./routes');

const app = express();

// Body parsers
app.express.json();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Serve static uploads
app.use('/uploads', express.static(config.uploadDir));

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
```

---

## 📋 Usage Examples

### Example 1: Protected Route with Role Check
```javascript
router.get('/hod/dashboard',
  authenticate,        // Verify JWT
  requireHOD,          // Check HOD role
  dashboardController.getHODDashboard
);
```

### Example 2: Validation with Multiple Rules
```javascript
router.post('/students',
  authenticate,
  validate([
    body('usn').notEmpty().withMessage('USN is required'),
    body('name').notEmpty().isLength({ min: 3 }),
    body('email').isEmail(),
    body('semester').isInt({ min: 1, max: 8 }),
    body('section').isIn(['A', 'B', 'C']),
  ]),
  studentController.create
);
```

### Example 3: File Upload with Validation
```javascript
router.post('/faculty/:id/photo',
  authenticate,
  validateId,
  uploadPhoto.single('photo'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'Photo is required');
      }
      
      const photoUrl = getUploadUrl(`photos/${req.file.filename}`);
      
      // Save photo URL to database
      await facultyService.updatePhoto(req.params.id, photoUrl);
      
      success(res, { photoUrl });
    } catch (error) {
      // Delete uploaded file if error
      if (req.file) {
        await deleteUploadedFile(`photos/${req.file.filename}`);
      }
      next(error);
    }
  }
);
```

### Example 4: Optional Authentication
```javascript
router.get('/public/posts',
  optionalAuth,  // Try to authenticate, but don't fail if no token
  async (req, res) => {
    const posts = await postService.getPosts({
      includePrivate: !!req.user,  // Show private posts if authenticated
      userId: req.user?.id,
    });
    
    success(res, posts);
  }
);
```

### Example 5: Error Handling
```javascript
const { ApiError } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// Throw errors anywhere in your code
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  success(res, user);
}));

// Error handler automatically catches and formats the error
```

---

## 🔧 Environment Variables

```env
# File Upload
MAX_PHOTO_SIZE=5242880        # 5MB in bytes
MAX_DOCUMENT_SIZE=10485760    # 10MB in bytes
MAX_FILE_SIZE=10485760        # 10MB in bytes

# Upload URL
BASE_URL=http://localhost:4000
```

---

## ✅ Migration from Old Systems

### Admin-erp Pattern
```javascript
// Before (Admin-erp)
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { notFound, errorHandler } = require('../middleware/errorHandler');

// After (Unified) - No change needed!
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { notFound, errorHandler } = require('../middleware/errorHandler');
```

### education_erp Pattern
```javascript
// Before (education_erp)
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../middlewares/upload.middleware');

// After (Unified)
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { checkValidation } = require('../middleware/validate');
const { uploadPhoto } = require('../middleware/upload');
```

---

## 📊 Middleware Summary

| Middleware | Purpose | Source |
|------------|---------|--------|
| `authenticate` | JWT authentication | Admin-erp + education_erp |
| `requireHOD` | HOD role check | education_erp |
| `requireRole` | Specific role check | education_erp |
| `requireAdmin` | Admin role check | New |
| `requireSameDepartment` | Department isolation | education_erp |
| `optionalAuth` | Optional auth | New |
| `notFound` | 404 handler | Admin-erp + education_erp |
| `errorHandler` | Global error handler | Admin-erp + education_erp |
| `catchAsync` | Async error wrapper | New |
| `validate` | Validation (with chains) | Admin-erp |
| `checkValidation` | Validation (inline) | education_erp |
| `sanitize` | Body sanitization | New |
| `validatePagination` | Pagination validation | New |
| `validateId` | ID param validation | New |
| `uploadPhoto` | Photo upload | education_erp |
| `uploadDocument` | Document upload | education_erp |
| `uploadAny` | Any file upload | education_erp |

---

## ✅ Status

**Middleware layer is complete and ready!**

- ✅ 5 middleware files created
- ✅ Authentication with JWT (header + cookie)
- ✅ Role-based authorization
- ✅ Comprehensive error handling
- ✅ Request validation (dual patterns)
- ✅ File upload handling
- ✅ Full backward compatibility

---

**Date**: August 6, 2026  
**Version**: 1.0.0  
**Systems Unified**: 3 (Admin-erp, faculty_student, education_erp)
