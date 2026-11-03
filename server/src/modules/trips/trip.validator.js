const { body, validationResult } = require('express-validator');

const validateCreateTrip = [
  body('title').trim().isLength({ min: 4, max: 120 }).withMessage('Title must be between 4 and 120 characters'),
  body('source').trim().isLength({ min: 2, max: 80 }).withMessage('Source is required'),
  body('destination').trim().isLength({ min: 2, max: 80 }).withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('budgetPerPerson').isFloat({ min: 1, max: 10000000 }).withMessage('Budget must be between ₹1 and ₹10,000,000'),
  body('maxMembers').isInt({ min: 2, max: 20 }).withMessage('Group size must be between 2 and 20'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('meetingPoint').optional().trim().isLength({ max: 160 }).withMessage('Meeting point cannot exceed 160 characters'),
  body('requirements').optional().trim().isLength({ max: 500 }).withMessage('Requirements cannot exceed 500 characters'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateCreateTrip, handleValidationErrors };
