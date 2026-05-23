import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('Email นี้ถูกใช้งานแล้ว')
  }

  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({ username, email, password, role })

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    token: generateToken(user._id)
  })
})

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('กรุณากรอก email และรหัสผ่าน')
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Email หรือรหัสผ่านไม่ถูกต้อง')
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    token: generateToken(user._id)
  })
})

// @desc    Get profile
// @route   GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error('ไม่พบผู้ใช้งาน')
  }
  res.json(user)
})

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error('ไม่พบผู้ใช้งาน')
  }

  user.username = req.body.username || user.username
  user.email = req.body.email || user.email
  user.profileImage = req.body.profileImage || user.profileImage

  if (req.body.password) {
    user.password = req.body.password
  }

  const updated = await user.save()

  res.json({
    _id: updated._id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    profileImage: updated.profileImage,
    token: generateToken(updated._id)
  })
})