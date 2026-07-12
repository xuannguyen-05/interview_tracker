import prisma from '../../config/prisma.js'

const createNotification = async({application_id, user_id, title, type, message}) => {
    return prisma.notification.create({
        data: {
            application_id, 
            user_id, 
            title, 
            type, 
            message
        }
    })
}


const getNotificationsService = async(user_id) => {
    const notifications = await prisma.notification.findMany({
        where: {
            user_id
        },

        orderBy: {
            created_at: "desc"
        },

        select: {
            notification_id: true,
            type: true,
            application_id: true,
            title: true,
            message: true,
            is_read: true,
            created_at: true
        }
    })

    return notifications
}

const getNotificationUnreadCountService = async(user_id) => {
    const count = await prisma.notification.count({
        where: {
            user_id,
            is_read: false
        }
    })

    return count
}

const updateNotificationReadService = async(notification_id, user_id) => {
    if (Number.isNaN(notification_id)) {
        throw new AppError("Invalid Notification ID", 400, "INVALID_NOTIFICATION_ID")
    }

    const notification = await prisma.notification.findFirst({
        where: {
            notification_id,
            user_id
        }
    })

    if(!notification){
        throw new AppError("Notification not found", 404, "NOTIFICATION_NOT_FOUND")
    }

    if(notification.is_read){
        return notification
    }

    return prisma.notification.update({
        where: {
            notification_id
        },

        data: {
            is_read: true
        }
    })
}

const updateNotificationReadAllService = async(user_id) => {

    const updatedMany = await prisma.notification.updateMany({
        where: {
            user_id,
            is_read: false
        },

        data: {
            is_read: true
        }
    })

    return updatedMany
}



export {
    createNotification,
    getNotificationsService,
    getNotificationUnreadCountService,
    updateNotificationReadService,
    updateNotificationReadAllService
}
