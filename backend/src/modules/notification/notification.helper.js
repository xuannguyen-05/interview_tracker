import {createNotification} from './notification.service.js'
import emitNotification from '../../utils/socket.helper.js'

const notify = async({application_id, user_id, type}) => {
    const notif = await createNotification({
        application_id, 
        user_id, 
        type
    })

    emitNotification(user_id, notif)

    return notif

}

export default notify



