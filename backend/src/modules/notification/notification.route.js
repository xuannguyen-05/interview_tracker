import express from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import {getNotifications,
        getNotificationUnreadCount,
        updateNotificationRead,
        updateNotificationReadAll
} from './notification.controller.js'
import validate from '../../middlewares/validate.middleware.js'


const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications)
router.get("/unread-count", getNotificationUnreadCount)
router.patch("/:id/read", updateNotificationRead)
router.patch("/read-all", updateNotificationReadAll)




export default router