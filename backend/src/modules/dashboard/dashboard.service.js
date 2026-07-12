import prisma from '../../config/prisma.js'
import notify from '../notification/notification.helper.js'
import { NotificationType } from "@prisma/client";

const checkFollowUpNotifications = async(user_id) => {
    const applications = await prisma.application.findMany({
        where: {
            user_id,
            is_deleted: false,

            status: {
                notIn: ["OFFER", 'REJECTED']
            }
        }

    })

    for(const application of applications){
        const days = Math.floor((Date.now() - application.last_status_changed_at.getTime()) / (1000 * 60 * 60 * 24))

        if( days >= 10 ){

            const existed = await prisma.notification.findFirst({
                where: {
                    application_id: application.application_id,
                    type: NotificationType.FOLLOW_UP_10
                }
            })

            if(!existed){
                await notify({
                    application_id: application.application_id,
                    user_id,
                    type: NotificationType.FOLLOW_UP_10,
                    data: {
                        company_name: application.company_name
                    }
                })
            }

            
        }else if ( days >= 7){
            const existed = await prisma.notification.findFirst({
                where: {
                    application_id: application.application_id,
                    type: NotificationType.FOLLOW_UP_7
                }
            })

            if(!existed){
                await notify({
                    application_id: application.application_id,
                    user_id,
                    type: NotificationType.FOLLOW_UP_7,
                    data: {
                        company_name: application.company_name
                    }
                })
            }
        }
    }
}

const getApplicationStats  = async(user_id) => {
    const [
        total_applications, 
        grouped
    ] = await Promise.all([

        prisma.application.count({
            where: {
                user_id,
                is_deleted: false
            }
        }),

        prisma.application.groupBy({
            by: ["status"],
            where: {
                user_id,
                is_deleted: false
            },
            _count: {
                status: true
            }
        })
    ])

    const counts = Object.fromEntries(
        grouped.map(item => [item.status, item._count.status])
    )

    return {
        total_applications, 
        counts
    }
}

const buildSummary = ({total_applications, counts}) => {

    const interview = counts.INTERVIEW ?? 0
    const offer = counts.OFFER ?? 0
    const rejected = counts.REJECTED ?? 0


    const interview_rate = total_applications 
        ? interview / total_applications * 100 
        : 0

    const offer_rate = total_applications 
        ? offer / total_applications * 100 
        : 0

    const rejection_rate = total_applications 
        ? rejected / total_applications * 100 
        : 0
    

    return {
        total_applications, 

        interview,
        offer,
        rejected,

        interview_rate,
        offer_rate,
        rejection_rate
    }
}

const buildFunnel = ({total_applications, counts}) => {

    const interview = counts.INTERVIEW ?? 0
    const offer = counts.OFFER ?? 0

    const interview_rate = total_applications 
        ? interview / total_applications * 100 
        : 0

    const offer_rate = interview 
        ? offer / interview * 100 
        : 0
    

    return {
        total_applications, 

        interview,
        offer,

        interview_rate,
        offer_rate,
    }
}

const urgentApplications = async(user_id) => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return prisma.application.findMany({
        where: {
            user_id,
            is_deleted: false,

            last_status_changed_at: {
                lte: sevenDaysAgo
            },

            status: {
                notIn: ["OFFER", 'REJECTED']
            }
        },

        orderBy: {
            last_status_changed_at: "asc"
        }, 

        take: 5
    })
}

const recentApplications = async(user_id) => {
    return prisma.application.findMany({
        where: {
            user_id,
            is_deleted: false,
        },
        orderBy: {
            created_at: "desc"
        },

        take: 5
    })
}


const dashboardService = async(user_id) => {

    await checkFollowUpNotifications(user_id)
    
    const stats = await getApplicationStats(user_id)

    const getSummary = buildSummary(stats)
    const getFunnel = buildFunnel(stats)
    const [urgent, recent] = await Promise.all([
        await urgentApplications(user_id),
        await recentApplications(user_id)
    ])
    
    return {
        summary,
        funnel,
        urgentApplications: urgent,
        recentApplications: recent
    }
}

const getMonthlyService = async(user_id, year) => {
    const result = await prisma.$queryRaw`
        SELECT 
            MONTH(apply_date) AS month,
            COUNT(*) As count
        FROM Application
        WHERE user_id = ${user_id}
            AND YEAR(apply_date) = ${year}
            AND is_deleted = false
        GROUP BY MONTH(apply_date)
        ORDER BY month
    `

    const monthly = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        count: 0
    }))

    result.forEach(item => {
        monthly[item.month - 1].count = Number(item.count)
    })

    return monthly 
}

export {
    dashboardService,
    getMonthlyService
}