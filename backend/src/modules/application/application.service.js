import { ApplicationStatus } from '@prisma/client'
import prisma from '../../config/prisma.js'
import AppError from '../../utils/AppError.js'
import notify from '../notification/notification.helper.js'

const findApplicationHelper = async (application_id, user_id) => {
    if (Number.isNaN(application_id)) {
        throw new AppError(
            "Invalid Application ID",
            400,
            "INVALID_APPLICATION_ID"
        )
    }

    const application = await prisma.application.findFirst({
        where: {
            application_id,
            user_id,
            is_deleted: false
        }
    })

    if (!application) {
        throw new AppError(
            "Application not found",
            404,
            "APPLICATION_NOT_FOUND"
        )
    }

    return application
}


const getApplicationsService = async(user_id, query) => {
    const {search, status, month, year} = query

    const where = {
        user_id,
        is_deleted: false
    }

    if (search){
        where.OR = [
            {
                company_name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                position: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ]
    }

    if(status){
        where.status = status
    }

    if(month && year){

        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 1)

        where.apply_date = {
            gte: startDate,
            lt: endDate
        }
    }

    const applications = await prisma.application.findMany({
        where,
        orderBy: {
            apply_date: "desc"
        }
    })

    return applications
}


const getApplicationByIdService = async(application_id, user_id) => {

    return findApplicationHelper(application_id, user_id)
}

const createApplicationService = async(user_id, data) => {
    const application = await prisma.application.create({
        data: {
            user_id,
            company_name: data.company_name,
            position: data.position,
            apply_date: data.apply_date,
            job_url: data.job_url ?? null,
            notes: data.notes ?? null,

        }
    })

    return application
}

const updateApplicationService = async(application_id, user_id, data) => {

    await findApplicationHelper(application_id, user_id)

    const allowedFields = ["company_name", "position", "apply_date", "job_url", "notes"]
    const updateData = {}

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field]
        }
    }

    const application = await prisma.application.update({
        where: {
            application_id
        },

        data: updateData
    })

    return application
}

const deleteApplicationService = async(application_id, user_id) => {

    await findApplicationHelper(application_id, user_id)

    await prisma.application.update({
        where: {
            application_id
        },

        data: {
            is_deleted: true,
            deleted_at: new Date()
        }
    })
}

const updateStatusApplicationService = async(application_id, user_id, data) => {

    const existApplication = await findApplicationHelper(application_id, user_id)

    if (existApplication.status === data.status) {
        return existApplication
    }

    const updated = await prisma.$transaction(async (tx) => {

        const updated = await tx.application.update({
            where: {
                application_id
            },
            data: {
                status: data.status,
                last_status_changed_at: new Date()
            }
        })

        await tx.statusHistory.create({
            data: {
                application_id,
                old_status: existApplication.status,
                new_status: data.status
            }
        })
        
        return updated
    })

    switch (data.status) {
        case ApplicationStatus.INTERVIEW:
        case ApplicationStatus.OFFER:
        case ApplicationStatus.REJECTED:
            await notify({
                application_id,
                user_id,
                type: data.status,
                data: {
                    company_name: existApplication.company_name
                }
            });
            break;
    }

    return updated
}


export {
    getApplicationsService, 
    getApplicationByIdService,
    createApplicationService,
    updateApplicationService,
    deleteApplicationService,
    updateStatusApplicationService
}