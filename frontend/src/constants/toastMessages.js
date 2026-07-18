// Toast messages organized by module
export const TOAST_MESSAGES = {
  // Auth Module
  auth: {
    login: {
      success: {
        message: "Login successful!",
        type: "success",
      },
    },

    logout: {
      success: {
        message: "Logged out successfully",
        type: "success",
      },
    },

    register: {
      success: {
        message: "Account created successfully!",
        type: "success",
      },
    },
  },

  // Application Module
  application: {
    create: {
      success: {
        message: "Application created successfully!",
        type: "success",
      },
    },
    update: {
      success: {
        message: "Application updated successfully!",
        type: "success",
      },
    },
    delete: {
      success: {
        message: "Application deleted successfully!",
        type: "success",
      },
      confirm: {
        message: "Are you sure you want to delete this application?",
        type: "confirm",
      },
    },
    updateStatus: {
      success: {
        message: "Status updated successfully!",
        type: "success",
      },
    },
  },

  // Notification Module
  notification: {
    markAsRead: {
      success: {
        message: "Notification marked as read",
        type: "success",
      },
    },
    markAllAsRead: {
      success: {
        message: "All notifications marked as read",
        type: "success",
      },
    },
  },

  // General
  general: {
    error: {
      message: "Something went wrong. Please try again.",
      type: "error",
    },
    success: {
      message: "Operation completed successfully!",
      type: "success",
    },
    loading: {
      message: "Loading...",
      type: "loading",
    },
  },
};

// Helper function to get toast message
export function getToastMessage(module, action, result = "success") {
  try {
    return TOAST_MESSAGES[module][action][result];
  } catch (error) {
    return TOAST_MESSAGES.general.error;
  }
}
