import {getNotificationsService, 
    getNotificationUnreadCountService,
    updateNotificationReadService,
    updateNotificationReadAllService
} from './notification.service'
import asyncHandler from '../../utils/asyncHandler.js'

const getNotifications = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id

    const notifications = await getNotificationsService(user_id)

    res.status(200).json({
        message: "Get notifications success",
        data: notifications
    })
})

const getNotificationUnreadCount = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id

    const count = await getNotificationUnreadCountService(user_id)

    res.status(200).json({
        message: "Get notification unread count success",
        data: notifications
    })
})

const updateNotificationRead = asyncHandler(async(req, res) => {
    
    const notification_id = +req.params.id

    const user_id = req.user.user_id

    const updated = await updateNotificationReadService(notification_id, user_id)

    res.status(200).json({
        message: "Updated notification success",
        data: updated
    })
})


const updateNotificationReadAll = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id

    const updatedMany = await updateNotificationReadAllService(user_id)

    res.status(200).json({
        message: "Updated notifications success",
        data: updatedMany
    })
})

export {
    getNotifications, 
    getNotificationUnreadCount,
    updateNotificationRead,
    updateNotificationReadAll
}