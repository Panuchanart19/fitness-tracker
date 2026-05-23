import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetCalories: {
      type: Number,
      required: true,
      min: [1, 'เป้าหมายแคลอรี่ต้องมากกว่า 0']
    },
    targetDuration: {
      type: Number,
      required: true,
      min: [1, 'เป้าหมายเวลาต้องมากกว่า 0']
    },
    targetActivities: {
      type: Number,
      default: 1
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

const Goal = mongoose.model('Goal', goalSchema)
export default Goal