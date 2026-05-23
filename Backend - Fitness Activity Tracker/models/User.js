import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'กรุณากรอก username'],
      trim: true,
      minlength: [3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร']
    },
    email: {
      type: String,
      required: [true, 'กรุณากรอก email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'รูปแบบ email ไม่ถูกต้อง']
    },
    password: {
      type: String,
      required: [true, 'กรุณากรอกรหัสผ่าน'],
      minlength: [6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profileImage: {
      type: String,
      default: ''
    },
    dailyGoal: {
      calories: { type: Number, default: 500 },
      duration: { type: Number, default: 60 }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Hash password ก่อน save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method เปรียบเทียบ password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User