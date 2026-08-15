import i18n from '@/i18n';

export const TOAST_MESSAGES = {
  auth: {
    login: {
      success: { messageKey: 'toast.auth.login.success', type: 'success' },
      error: { messageKey: 'toast.auth.login.error', type: 'error' },
    },
    logout: {
      success: { messageKey: 'toast.auth.logout.success', type: 'success' },
      error: { messageKey: 'toast.auth.logout.error', type: 'error' },
    },
    register: {
      success: { messageKey: 'toast.auth.register.success', type: 'success' },
      error: { messageKey: 'toast.auth.register.error', type: 'error' },
    },
    google: {
      success: { messageKey: 'toast.auth.google.success', type: 'success' },
      error: { messageKey: 'toast.auth.google.error', type: 'error' },
    },
    forgotPassword: {
      success: { messageKey: 'toast.auth.forgotPassword.success', type: 'success' },
      error: { messageKey: 'toast.auth.forgotPassword.error', type: 'error' },
    },
    resetPassword: {
      success: { messageKey: 'toast.auth.resetPassword.success', type: 'success' },
      error: { messageKey: 'toast.auth.resetPassword.error', type: 'error' },
    },
  },

  application: {
    create: {
      success: { messageKey: 'toast.application.create.success', type: 'success' },
      error: { messageKey: 'toast.application.create.error', type: 'error' },
    },
    update: {
      success: { messageKey: 'toast.application.update.success', type: 'success' },
      error: { messageKey: 'toast.application.update.error', type: 'error' },
    },
    delete: {
      success: { messageKey: 'toast.application.delete.success', type: 'success' },
      error: { messageKey: 'toast.application.delete.error', type: 'error' },
      confirm: { messageKey: 'toast.application.delete.confirm', type: 'confirm' },
    },
    updateStatus: {
      success: { messageKey: 'toast.application.updateStatus.success', type: 'success' },
      error: { messageKey: 'toast.application.updateStatus.error', type: 'error' },
    },
  },

  notification: {
    markAsRead: {
      success: { messageKey: 'toast.notification.markAsRead.success', type: 'success' },
      error: { messageKey: 'toast.notification.markAsRead.error', type: 'error' },
    },
    markAllAsRead: {
      success: { messageKey: 'toast.notification.markAllAsRead.success', type: 'success' },
      error: { messageKey: 'toast.notification.markAllAsRead.error', type: 'error' },
    },
  },

  general: {
    error: { messageKey: 'toast.general.error', type: 'error' },
    success: { messageKey: 'toast.general.success', type: 'success' },
    loading: { messageKey: 'toast.general.loading', type: 'loading' },
  },
};

export function getToastMessage(module, action, result = 'success') {
  try {
    const entry = TOAST_MESSAGES[module]?.[action]?.[result] ?? TOAST_MESSAGES.general.error;
    return {
      ...entry,
      message: i18n.t(entry.messageKey),
    };
  } catch {
    return {
      ...TOAST_MESSAGES.general.error,
      message: i18n.t(TOAST_MESSAGES.general.error.messageKey),
    };
  }
}
