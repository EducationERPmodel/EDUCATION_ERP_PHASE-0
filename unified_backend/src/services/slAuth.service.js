const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const slFacultyRepo = require('../repositories/slFacultyRepository');

const SlAuthService = {
  async login(email, password) {
    const faculty = await slFacultyRepo.findByEmail(email);
    if (!faculty) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, faculty.password);
    if (!valid) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { id: faculty.id, email: faculty.email, role: faculty.role, name: faculty.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: { id: faculty.id, name: faculty.name, email: faculty.email, role: faculty.role }
    };
  }
};

module.exports = SlAuthService;
