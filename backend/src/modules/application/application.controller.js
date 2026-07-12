import {getApplicationsService, 
    getApplicationByIdService,
    createApplicationService,
    updateApplicationService,
    deleteApplicationService,
    updateStatusApplicationService}
    from './application.service.js'
import asyncHandler from '../../utils/asyncHandler.js'

const getApplications = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id

    const applications = await getApplicationsService(user_id, req.query)

    res.status(200).json({
        message: "Get applications success",
        data: applications
    })
})

const getApplicationById = asyncHandler(async(req, res) => {

    const application_id = +req.params.id

    const user_id = req.user.user_id

    const application = await getApplicationByIdService(application_id, user_id)

    res.status(200).json({
        message: "Get application by id success",
        data: application
    })
})


const createApplication = asyncHandler(async(req, res) => {
    
    const user_id = req.user.user_id

    const created = await createApplicationService(user_id, req.body)

    res.status(201).json({
        message: "Create application success",
        data: created
    })

})


const updateApplication = asyncHandler(async(req, res) => {
    
    const application_id = +req.params.id

    const user_id = req.user.user_id

    const updated = await updateApplicationService(application_id, user_id, req.body)

    res.status(200).json({
        message: "Update application success",
        data: updated
    })

})

const deleteApplication = asyncHandler(async(req, res) => {
    
    const application_id = +req.params.id

    const user_id = req.user.user_id
    
    await deleteApplicationService(application_id, user_id)

    res.status(200).json({
        message: "Delete application success"
    })
})

const updateStatusApplication = asyncHandler(async(req, res) => {
    
    const application_id = +req.params.id

    const user_id = req.user.user_id

    const updatedStatus = await updateStatusApplicationService(application_id, user_id, req.body)

    res.status(200).json({
        message: "Update status application success",
        data: updatedStatus
    })

})

export {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    updateStatusApplication
}