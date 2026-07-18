// Toast configuration for react-hot-toast
export const TOAST_CONFIG = {
  // Duration in milliseconds
  duration: {
    success: 3000,
    error: 4000,
    loading: 2000,
    default: 3000,
  },

  // Styling for each toast type
  style: {
    success: {
      background: "#10B981",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    error: {
      background: "#EF4444",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    loading: {
      background: "#6366F1",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    default: {
      background: "#1E293B",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },

  // Icons for each toast type (using emoji for simplicity, can be replaced with SVG icons)
  icon: {
    success: "✓",
    error: "✕",
    loading: "⟳",
    default: "ℹ",
  },

  // Position
  position: "top-right",

  // Global options
  options: {
    closeButton: false,
    draggable: true,
    pauseOnHover: true,
    closeOnClick: false,
  },
}

// Helper function to get config for a specific type
export function getToastConfig(type) {
  return {
    duration: TOAST_CONFIG.duration[type] || TOAST_CONFIG.duration.default,
    style: TOAST_CONFIG.style[type] || TOAST_CONFIG.style.default,
    icon: TOAST_CONFIG.icon[type] || TOAST_CONFIG.icon.default,
    ...TOAST_CONFIG.options,
  }
}
