import toast from "react-hot-toast"
import { getToastMessage } from "@/constants/toastMessages"
import { getToastConfig } from "@/services/toastConfig"

/**
 * Centralized toast service
 * Call this service for all toast notifications
 */
class ToastService {
  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success, error, loading)
   * @param {object} options - Additional options for the toast
   */
  show(message, type = "default", options = {}) {
    const config = getToastConfig(type)
    const mergedOptions = { ...config, ...options }

    switch (type) {
      case "success":
        return toast.success(message, mergedOptions)
      case "error":
        return toast.error(message, mergedOptions)
      case "loading":
        return toast.loading(message, mergedOptions)
      default:
        return toast(message, mergedOptions)
    }
  }

  /**
   * Show toast by module and action
   * @param {string} module - The module name (auth, application, etc.)
   * @param {string} action - The action name (login, create, update, etc.)
   * @param {string} result - The result (success, error)
   * @param {object} options - Additional options for the toast
   */
  showByModule(module, action, result = "success", options = {}) {
    const toastData = getToastMessage(module, action, result)
    return this.show(toastData.message, toastData.type, options)
  }

  /**
   * Show success toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  success(message, options = {}) {
    return this.show(message, "success", options)
  }

  /**
   * Show error toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  error(message, options = {}) {
    return this.show(message, "error", options)
  }

  /**
   * Show loading toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  loading(message, options = {}) {
    return this.show(message, "loading", options)
  }

  /**
   * Dismiss a toast by ID
   * @param {string} toastId - The ID of the toast to dismiss
   */
  dismiss(toastId) {
    toast.dismiss(toastId)
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    toast.dismiss()
  }

  /**
   * Promise-based toast - shows loading then success/error
   * @param {Promise} promise - The promise to track
   * @param {object} messages - Messages for loading, success, and error
   * @param {object} options - Additional options
   */
  promise(promise, messages = {}, options = {}) {
    const {
      loading = "Loading...",
      success = "Success!",
      error = "Something went wrong",
    } = messages

    return toast.promise(promise, {
      loading,
      success,
      error,
    }, options)
  }
}

// Export singleton instance
export const toastService = new ToastService()

// Export default for convenience
export default toastService
