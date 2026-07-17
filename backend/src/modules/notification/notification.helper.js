import generateNotificationContent from '../../utils/notification.helper.js'
import {createNotification} from './notification.service.js'
import emitNotification from '../../utils/socket.helper.js'

const notify = async({application_id, user_id, type, data = {}}) => {
    const content = generateNotificationContent(type, data)

    const notif = await createNotification({
        application_id, 
        user_id, 
        title: content.title, 
        type,
        message: content.message
    })

    emitNotification(user_id, notif)

    return notif

}

export default notify



