// Centralized error code mapping - synchronized with backend error codes
// Backend source: backend/src/utils/AppError.js, auth.middleware.js, auth.service.js, application.service.js

export const ERROR_MESSAGES = {
  // Auth errors from auth.middleware.js
  NO_TOKEN: "Your session has expired. Please log in again.",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_TOKEN: "Invalid session. Please log in again.",
  USER_NOT_VALID: "Invalid account. Please log in again.",

  // Auth errors from auth.service.js
  EMAIL_EXISTS: "This email is already registered.",
  INVALID_CREDENTIALS: "Invalid email or password.",

  // Application errors from application.service.js
  INVALID_APPLICATION_ID: "Invalid application ID.",
  APPLICATION_NOT_FOUND: "Application not found.",

  // Generic HTTP errors from errorHandler.middleware.js
  BAD_REQUEST: "Invalid request.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  INTERNAL_ERROR: "An error occurred. Please try again.",
}

export const DEFAULT_ERROR_MESSAGE = "An error occurred. Please try again."
