import express from 'express'
import validate from '../../middlewares/validate.middleware.js'
import {getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    updateStatusApplication}
    from './application.controller.js'
import {createApplicationSchema, updateApplicationSchema, updateStatusSchema, filterApplicationSchema} from './application.schema.js'
import authMiddleware from '../../middlewares/auth.middleware.js'


const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createApplicationSchema), createApplication)
router.get("/", validate(filterApplicationSchema, 'query'), getApplications)
router.get("/:id", getApplicationById)
router.patch("/:id", validate(updateApplicationSchema), updateApplication)
router.patch("/:id/status", validate(updateStatusSchema), updateStatusApplication)
router.delete("/:id", deleteApplication)



export default router