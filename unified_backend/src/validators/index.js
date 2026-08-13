/**
 * Unified Validators Index
 * Central export point for all validation rule sets
 */

const authValidator     = require('./authValidator');
const studentValidator  = require('./studentValidator');
const transferValidator = require('./transferValidator');
const facultyValidator  = require('./facultyValidator');
const activityValidator = require('./activityValidator');

module.exports = {
  ...authValidator,
  ...studentValidator,
  ...transferValidator,
  ...facultyValidator,
  ...activityValidator,
};
