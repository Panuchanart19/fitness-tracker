import asyncHandler from 'express-async-handler'
import Goal from '../models/Goal.js'
import Activity from '../models/Activity.js'

// @desc    Get goals with progress
// @route   GET /api/goals
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id, isActive: true })

  // คำนวณ progress วันนี้
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayStats = await Activity.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: today, $lt: tomorrow }
      }
    },
    {
      $group: {
        _id: null,
        calories: { $sum: '$calories' },
        duration: { $sum: '$duration' },
        count: { $sum: 1 }
      }
    }
  ])

  const stats = todayStats[0] || { calories: 0, duration: 0, count: 0 }

  const goalsWithProgress = goals.map(goal => ({
    ...goal.toObject(),
    progress: {
      calories: Math.min((stats.calories / goal.targetCalories) * 100, 100),
      duration: Math.min((stats.duration / goal.targetDuration) * 100, 100),
      activities: Math.min((stats.count / goal.targetActivities) * 100, 100)
    },
    current: stats
  }))

  res.json(goalsWithProgress)
})

// @desc    Create goal
// @route   POST /api/goals
export const createGoal = asyncHandler(async (req, res) => {
  const { targetCalories, targetDuration, targetActivities, period } = req.body

  // deactivate เป้าหมายเดิมในช่วงเดียวกัน
  await Goal.updateMany(
    { user: req.user._id, period, isActive: true },
    { isActive: false }
  )

  const goal = await Goal.create({
    user: req.user._id,
    targetCalories,
    targetDuration,
    targetActivities: targetActivities || 1,
    period: period || 'daily'
  })

  res.status(201).json(goal)
})

// @desc    Update goal
// @route   PUT /api/goals/:id
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  )

  if (!goal) {
    res.status(404)
    throw new Error('ไม่พบเป้าหมาย')
  }

  res.json(goal)
})