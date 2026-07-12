import { NotificationType } from "@prisma/client";

export default function generateNotificationContent(type, data = {}) {
  const { company_name_name } = data;

  switch (type) {
    case NotificationType.INTERVIEW:
      return {
        title: "Interview Invitation",
        message: `${company_name} moved your application to Interview.`,
      };

    case NotificationType.OFFER:
      return {
        title: "Congratulations! 🎉",
        message: `You received an offer from ${company_name}.`,
      };

    case NotificationType.REJECTED:
      return {
        title: "Application Update",
        message: `${company_name} marked your application as Rejected.`,
      };

    case NotificationType.FOLLOW_UP_7:
      return {
        title: "Follow Up Reminder",
        message: `No response from ${company_name} for 7 days.`,
      };

    case NotificationType.FOLLOW_UP_10:
      return {
        title: "Follow Up Reminder",
        message: `No response from ${company_name} for 10 days.`,
      };

    default:
      return {
        title: "Notification",
        message: "You have a new notification.",
      };
  }
}
