/**
 * Backward Compatibility: apiResponse.js
 * Redirects to unified response.js for Admin-erp pattern
 * 
 * This file maintains compatibility with Admin-erp imports:
 * const { success } = require('../utils/apiResponse');
 */

const { ApiError, success } = require('./response');

module.exports = { ApiError, success };
