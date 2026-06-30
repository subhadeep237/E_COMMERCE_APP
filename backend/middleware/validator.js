import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// ============ USER VALIDATIONS ============
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 100 }).withMessage("Password must be 8-100 characters"),

  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

export const validateOTP = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must be numeric"),

  handleValidationErrors,
];

export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  handleValidationErrors,
];

export const validateResetPassword = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8, max: 100 }).withMessage("Password must be 8-100 characters"),

  handleValidationErrors,
];

// ============ CART VALIDATIONS ============
export const validateAddToCart = [
  body("productId")
    .notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid product ID"),

  body("size")
    .notEmpty().withMessage("Size is required")
    .isString().withMessage("Size must be a string")
    .isLength({ max: 10 }).withMessage("Invalid size"),

  handleValidationErrors,
];

export const validateUpdateCart = [
  body("productId")
    .notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid product ID"),

  body("size")
    .notEmpty().withMessage("Size is required"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 0, max: 1000 }).withMessage("Quantity must be 0-1000"),

  handleValidationErrors,
];

// ============ ORDER VALIDATIONS ============
export const validatePlaceOrder = [
  body("items")
    .notEmpty().withMessage("Items are required")
    .isArray({ min: 1 }).withMessage("Items must be a non-empty array"),

  body("items.*.productId")
    .isMongoId().withMessage("Invalid product ID in items"),

  body("items.*.size")
    .notEmpty().withMessage("Size is required for all items"),

  body("items.*.quantity")
    .isInt({ min: 1, max: 100 }).withMessage("Quantity must be 1-100"),

  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 1 }).withMessage("Amount must be greater than 0"),

  body("address")
    .notEmpty().withMessage("Address is required")
    .isLength({ min: 10, max: 500 }).withMessage("Address must be 10-500 characters"),

  body("paymentMethod")
    .optional()
    .isIn(["COD", "ONLINE"]).withMessage("Payment method must be COD or ONLINE"),

  handleValidationErrors,
];

export const validateCancelOrder = [
  body("orderId")
    .notEmpty().withMessage("Order ID is required")
    .isMongoId().withMessage("Invalid order ID"),

  handleValidationErrors,
];

// ============ ADMIN VALIDATIONS ============
export const validateUpdateOrderStatus = [
  body("orderId")
    .notEmpty().withMessage("Order ID is required")
    .isMongoId().withMessage("Invalid order ID"),

  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status value"),

  handleValidationErrors,
];

export const validateAddProduct = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 2, max: 200 }).withMessage("Name must be 2-200 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 2000 }).withMessage("Description must be 10-2000 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be positive"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["Men", "Women", "Kids"]).withMessage("Invalid category"),

  body("subCategory")
    .notEmpty().withMessage("Sub-category is required")
    .isIn(["Topwear", "Bottomwear", "Winterwear", "Shirts"]).withMessage("Invalid sub-category"),

  handleValidationErrors,
];

// ============ REVIEW VALIDATIONS ============
export const validateAddReview = [
  body("productId")
    .notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid product ID"),

  body("rating")
    .notEmpty().withMessage("Rating is required")
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),

  body("comment")
    .trim()
    .notEmpty().withMessage("Comment is required")
    .isLength({ min: 5, max: 1000 }).withMessage("Comment must be 5-1000 characters"),

  handleValidationErrors,
];

// ============ COMMON VALIDATIONS ============
export const validateMongoId = (paramName = "id") => [
  param(paramName)
    .notEmpty().withMessage(`${paramName} is required`)
    .isMongoId().withMessage(`Invalid ${paramName}`),

  handleValidationErrors,
];

export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage("Page must be 1-1000"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be 1-100"),

  handleValidationErrors,
];