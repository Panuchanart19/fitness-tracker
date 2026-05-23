import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      required: [true, 'กรุณาเลือกประเภทกิจกรรม'],
      enum: [
        'วิ่ง', 'เดิน', 'ปั่นจักรยาน', 'ว่ายน้ำ',
        'เวทเทรนนิ่ง', 'ฟุตบอล', 'บาสเกตบอล',
        'โยคะ', 'HIIT', 'อื่นๆ'
      ]
    },
    duration: {
      type: Number,
      required: [true, 'กรุณากรอกระยะเวลา'],
      min: [1, 'ระยะเวลาต้องมากกว่า 0']
    },
    calories: {
      type: Number,
      required: [true, 'กรุณากรอกแคลอรี่'],
      min: [0, 'แคลอรี่ต้องไม่ติดลบ']
    },
    date: {
      type: Date,
      required: [true, 'กรุณาเลือกวันที่'],
      default: Date.now
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'หมายเหตุต้องไม่เกิน 500 ตัวอักษร']
    }
  },
  { timestamps: true }
)

// Index เพื่อประสิทธิภาพการค้นหา
activitySchema.index({ user: 1, date: -1 })
activitySchema.index({ user: 1, activityType: 1 })

const Activity = mongoose.model('Activity', activitySchema)
export default Activity