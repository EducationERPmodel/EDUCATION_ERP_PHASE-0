const slAuthService = require('../services/slAuth.service');

const SlAuthController = {
  // POST /api/hod/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await slAuthService.login(email, password);
      return res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = SlAuthController;
