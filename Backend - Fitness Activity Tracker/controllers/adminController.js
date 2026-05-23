import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Activity from '../models/Activity.js'

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const total = await User.countDocuments(query)
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select('-password')

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) })
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('ไม่พบผู้ใช้งาน')
  }
  if (user.role === 'admin') {
    res.status(400)
    throw new Error('ไม่สามารถลบ Admin ได้')
  }
  // ลบกิจกรรมของ user ด้วย
  await Activity.deleteMany({ user: req.params.id })
  await user.deleteOne()
  res.json({ message: 'ลบผู้ใช้งานสำเร็จ' })
})

// @desc    Get all activities (admin)
// @route   GET /api/admin/activities
export const getAllActivities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const total = await Activity.countDocuments()
  const activities = await Activity.find()
    .populate('user', 'username email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))

  res.json({ activities, total, page: Number(page), pages: Math.ceil(total / limit) })
})

// @desc    Delete any activity (admin)
// @route   DELETE /api/admin/activities/:id
export const deleteAnyActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id)
  if (!activity) {
    res.status(404)
    throw new Error('ไม่พบกิจกรรม')
  }
  res.json({ message: 'ลบกิจกรรมสำเร็จ' })
})

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' })
  const totalActivities = await Activity.countDocuments()

  const caloriesAgg = await Activity.aggregate([
    { $group: { _id: null, total: { $sum: '$calories' } } }
  ])

  const recentUsers = await User.find({ role: 'user' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username email createdAt')

  res.json({
    totalUsers,
    totalActivities,
    totalCalories: caloriesAgg[0]?.total || 0,
    recentUsers
  })
})