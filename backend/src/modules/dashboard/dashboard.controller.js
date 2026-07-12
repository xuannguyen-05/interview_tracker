import {dashboardService, getMonthlyService} from './dashboard.service.js'
import asyncHandler from '../../utils/asyncHandler.js'

const dashboard = asyncHandler(async(req, res) => {
    const user_id = req.user.user_id

    const dashboardData = await dashboardService(user_id)

     res.status(200).json({
        message: "Get dashboard success",
        data: dashboardData
    })
})

const getMonthly = asyncHandler(async(req, res) => {
    const user_id = req.user.user_id

    const year = req.query.year ?? new Date().getFullYear()

    const monthly = await getMonthlyService(user_id, year)

    res.status(200).json({
        message: "Get stats monthly success",
        data: monthly
    })

})

export {
    dashboard,
    getMonthly
}