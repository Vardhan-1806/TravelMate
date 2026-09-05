const { body, validationResult } = require('express-validator');

const validateCreateTrip = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('budgetPerPerson').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('maxMembers').isInt({ min: 1 }).withMessage('Max members must be at least 1'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateCreateTrip, handleValidationErrors };