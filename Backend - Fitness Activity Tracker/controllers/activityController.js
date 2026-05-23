import asyncHandler from 'express-async-handler'
import Activity from '../models/Activity.js'

// @desc    Get activities (with search & filter)
// @route   GET /api/activities
export const getActivities = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, search, page = 1, limit = 10 } = req.query

  const query = { user: req.user._id }

  if (type) query.activityType = type

  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  if (search) {
    query.$or = [
      { activityType: { $regex: search, $options: 'i' } },
      { note: { $regex: search, $options: 'i' } }
    ]
  }

  const total = await Activity.countDocuments(query)
  const activities = await Activity.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))

  res.json({
    activities,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  })
})

// @desc    Create activity
// @route   POST /api/activities
export const createActivity = asyncHandler(async (req, res) => {
  const { activityType, duration, calories, date, note } = req.body

  const activity = await Activity.create({
    user: req.user._id,
    activityType,
    duration,
    calories,
    date: date || Date.now(),
    note
  })

  res.status(201).json(activity)
})

// @desc    Update activity
// @route   PUT /api/activities/:id
export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id)

  if (!activity) {
    res.status(404)
    throw new Error('ไม่พบกิจกรรม')
  }

  if (activity.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('ไม่มีสิทธิ์แก้ไขกิจกรรมนี้')
  }

  const updated = await Activity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  res.json(updated)
})

// @desc    Delete activity
// @route   DELETE /api/activities/:id
export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id)

  if (!activity) {
    res.status(404)
    throw new Error('ไม่พบกิจกรรม')
  }

  if (activity.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('ไม่มีสิทธิ์ลบกิจกรรมนี้')
  }

  await activity.deleteOne()
  res.json({ message: 'ลบกิจกรรมสำเร็จ' })
})

// @desc    Get activity stats
// @route   GET /api/activities/stats
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // รวมแคลอรี่และเวลาทั้งหมด
  const totals = await Activity.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: '$calories' },
        totalDuration: { $sum: '$duration' },
        totalActivities: { $sum: 1 }
      }
    }
  ])

  // แคลอรี่รายวัน 7 วันล่าสุด
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dailyStats = await Activity.aggregate([
    { $match: { user: userId, date: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        calories: { $sum: '$calories' },
        duration: { $sum: '$duration' }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // กิจกรรมยอดนิยม
  const popularActivities = await Activity.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$activityType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ])

  res.json({
    totals: totals[0] || { totalCalories: 0, totalDuration: 0, totalActivities: 0 },
    dailyStats,
    popularActivities
  })
})