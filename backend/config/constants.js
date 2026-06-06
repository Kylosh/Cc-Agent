// Constants for Fruit Delivery API

const PRODUCT_CATEGORIES = [
  'tropical',
  'berries',
  'citrus',
  'stone',
  'melons',
  'dried',
  'other'
];

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const PAYMENT_METHOD = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer'
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized - Please log in',
  FORBIDDEN: 'Forbidden - Admin access required',
  NOT_FOUND: 'Resource not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_TAKEN: 'Email already registered',
  INVALID_TOKEN: 'Invalid or expired token',
  MISSING_FIELDS: 'Missing required fields',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  INVALID_STATUS: 'Invalid status value',
  INTERNAL_ERROR: 'Internal server error'
};

const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_DELETED: 'Order deleted successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully'
};

const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};

const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTES_LENGTH: 500,
  MIN_PRICE: 0,
  MIN_STOCK: 0,
  MIN_RATING: 0,
  MAX_RATING: 5
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

module.exports = {
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  USER_ROLES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION_DEFAULTS,
  VALIDATION_RULES,
  HTTP_STATUS
};
