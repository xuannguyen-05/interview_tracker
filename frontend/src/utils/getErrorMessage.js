import { ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from "./errorCodes"

export function getErrorMessage(error, fallback = DEFAULT_ERROR_MESSAGE) {
  const status = error?.response?.status
  const code = error?.response?.data?.code
  const message = error?.response?.data?.message

  // First check if we have a mapped error code
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  // Handle HTTP status codes
  if (status === 401) {
    return ERROR_MESSAGES.UNAUTHORIZED
  }

  if (status === 400 && message && !looksLikeInternalError(message)) {
    return message
  }

  // Block internal/technical errors from showing to user
  if (status >= 500 || looksLikeInternalError(message)) {
    return fallback
  }

  // Show message if it's not a technical error
  if (message && !looksLikeInternalError(message)) {
    return message
  }

  return fallback
}

function looksLikeInternalError(message = "") {
  const text = String(message).toLowerCase()

  return (
    text.includes("prisma") ||
    text.includes("invocation") ||
    text.includes("invalid value for argument") ||
    text.includes("internal server error") ||
    text.includes("unexpected")
  )
}
