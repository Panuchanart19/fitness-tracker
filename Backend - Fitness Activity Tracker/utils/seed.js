import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import connectDB from '../config/db.js'

dotenv.config()

const seedAdmin = async () => {
  await connectDB()

  try {
    // ลบ admin เดิม (ถ้ามี)
    await User.deleteOne({ email: 'admin@fitness.com' })

    // สร้าง Admin ใหม่
    const admin = await User.create({
      username: 'Admin',
      email: 'admin@fitness.com',
      password: 'Admin@123456',
      role: 'admin'
    })

    console.log('✅ Admin created:')
    console.log('   Email   :', admin.email)
    console.log('   Password: Admin@123456')
    console.log('   Role    :', admin.role)

  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    mongoose.disconnect()
    process.exit(0)
  }
}

seedAdmin()