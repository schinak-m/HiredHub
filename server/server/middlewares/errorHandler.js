const { validationResult } = require("express-validator");

function errorHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  next();
}

module.exports = { errorHandler };
