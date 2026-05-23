import express from 'express'
import {
  getAllUsers,
  deleteUser,
  getAllActivities,
  deleteAnyActivity,
  getAdminStats
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

router.use(protect, adminOnly) // ต้อง login + เป็น admin

router.get('/stats', getAdminStats)
router.get('/users', getAllUsers)
router.delete('/users/:id', deleteUser)
router.get('/activities', getAllActivities)
router.delete('/activities/:id', deleteAnyActivity)

export default router