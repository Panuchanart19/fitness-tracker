import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected')

  const db = mongoose.connection.db

  // ดู indexes ที่มีอยู่
  const indexes = await db.collection('users').indexes()
  console.log('📋 Current indexes:', indexes)

  // ลบ index username_1
  try {
    await db.collection('users').dropIndex('username_1')
    console.log('✅ Dropped username_1 index')
  } catch (e) {
    console.log('ℹ️ username_1 index not found (ok)')
  }

  // ล้าง users ทั้งหมด
  await db.collection('users').deleteMany({})
  console.log('✅ Cleared all users')

  console.log('🎉 Done! Now you can register again')
} catch (err) {
  console.error('❌ Error:', err.message)
} finally {
  mongoose.disconnect()
}