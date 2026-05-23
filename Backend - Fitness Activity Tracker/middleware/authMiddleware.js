import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('ไม่มีสิทธิ์เข้าถึง กรุณาล็อกอิน')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      res.status(401)
      throw new Error('ไม่พบผู้ใช้งาน')
    }

    next()
  } catch (error) {
    res.status(401)
    throw new Error('Token ไม่ถูกต้องหรือหมดอายุ')
  }
})