import express from 'express'
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getStats
} from '../controllers/activityController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect) // ทุก route ต้อง login

router.get('/stats', getStats)
router.route('/').get(getActivities).post(createActivity)
router.route('/:id').put(updateActivity).delete(deleteActivity)

export default router