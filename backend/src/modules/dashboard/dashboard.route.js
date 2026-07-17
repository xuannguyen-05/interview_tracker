import express from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import {dashboard, getMonthly} from './dashboard.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { monthlySchema } from './dashboard.schema.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', dashboard)
router.get('/monthly', validate(monthlySchema, "query"), getMonthly)



export default router