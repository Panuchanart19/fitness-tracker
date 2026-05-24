import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { activityService } from '../services/activityService'
import { toast } from 'react-toastify'

const TYPES = ['วิ่ง','เดิน','ปั่นจักรยาน','ว่ายน้ำ','เวทเทรนนิ่ง','ฟุตบอล','บาสเกตบอล','โยคะ','HIIT','อื่นๆ']

const TYPE_EMOJI = {
  'วิ่ง':'🏃','เดิน':'🚶','ปั่นจักรยาน':'🚴','ว่ายน้ำ':'🏊',
  'เวทเทรนนิ่ง':'🏋️','ฟุตบอล':'⚽','บาสเกตบอล':'🏀',
  'โยคะ':'🧘','HIIT':'🔥','อื่นๆ':'💪'
}

// แคลอรี่ต่อนาที (ค่าเฉลี่ยคนหนัก 70 kg)
const CALORIES_PER_MIN = {
  'วิ่ง': 11,
  'เดิน': 5,
  'ปั่นจักรยาน': 8,
  'ว่ายน้ำ': 10,
  'เวทเทรนนิ่ง': 7,
  'ฟุตบอล': 9,
  'บาสเกตบอล': 9,
  'โยคะ': 4,
  'HIIT': 13,
  'อื่นๆ': 6
}

const AddActivityPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [autoCalc, setAutoCalc] = useState(true)
  const [form, setForm] = useState({
    activityType: '',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  const calcCalories = (type, duration) => {
    if (!type || !duration) return ''
    const rate = CALORIES_PER_MIN[type] || 6
    return Math.round(rate * Number(duration))
  }

  const handleTypeSelect = (type) => {
    const calories = autoCalc ? calcCalories(type, form.duration) : form.calories
    setForm(p => ({ ...p, activityType: type, calories: calories || p.calories }))
  }

  const handleDurationChange = (e) => {
    const duration = e.target.value
    const calories = autoCalc ? calcCalories(form.activityType, duration) : form.calories
    setForm(p => ({ ...p, duration, calories: calories || p.calories }))
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.activityType) return toast.error('กรุณาเลือกประเภทกิจกรรม')
    if (!form.duration || form.duration <= 0) return toast.error('กรุณากรอกระยะเวลา')
    if (!form.calories || form.calories < 0) return toast.error('กรุณากรอกแคลอรี่')
    try {
      setLoading(true)
      await activityService.create({
        ...form,
        duration: Number(form.duration),
        calories: Number(form.calories)
      })
      toast.success('เพิ่มกิจกรรมสำเร็จ! 🎉')
      navigate('/activities')
    } catch (err) {
      toast.error(err.response?.data?.message || 'เพิ่มกิจกรรมไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/activities" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="page-title">เพิ่มกิจกรรม ➕</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">บันทึกการออกกำลังกายของคุณ</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Activity Type */}
          <div>
            <label className="label">ประเภทกิจกรรม *</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {TYPES.map(type => (
                <button key={type} type="button" onClick={() => handleTypeSelect(type)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                    form.activityType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-2xl">{TYPE_EMOJI[type]}</span>
                  <span className="text-center leading-tight">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Calories */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">⏱️ ระยะเวลา (นาที) *</label>
              <input
                type="number" name="duration" value={form.duration}
                onChange={handleDurationChange}
                placeholder="เช่น 30" min="1" className="input-field"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">🔥 แคลอรี่ (kcal) *</label>
                {/* Toggle Auto Calculate */}
                <button
                  type="button"
                  onClick={() => setAutoCalc(p => !p)}
                  className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${
                    autoCalc
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {autoCalc ? '⚡ อัตโนมัติ' : '✏️ กรอกเอง'}
                </button>
              </div>
              <input
                type="number" name="calories" value={form.calories}
                onChange={handleChange}
                placeholder="เช่น 300" min="0"
                readOnly={autoCalc}
                className={`input-field ${autoCalc ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' : ''}`}
              />
              {autoCalc && form.activityType && (
                <p className="text-xs text-primary-500 mt-1">
                  ⚡ คำนวณจาก {CALORIES_PER_MIN[form.activityType]} kcal/นาที
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label">📅 วันที่</label>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              max={new Date().toISOString().split('T')[0]} className="input-field" />
          </div>

          {/* Note */}
          <div>
            <label className="label">📝 หมายเหตุ (ไม่บังคับ)</label>
            <textarea name="note" value={form.note} onChange={handleChange}
              placeholder="บันทึกความรู้สึก หรือรายละเอียดเพิ่มเติม..."
              rows={3} className="input-field resize-none" />
          </div>

          {/* Preview */}
          {form.activityType && form.duration && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
            >
              <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">📋 สรุป</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-600 dark:text-primary-400">
                <span className="text-2xl">{TYPE_EMOJI[form.activityType]}</span>
                <span className="font-semibold">{form.activityType}</span>
                <span>· ⏱️ {form.duration} นาที</span>
                <span>· 🔥 {form.calories} kcal</span>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Link to="/activities" className="btn-secondary flex-1 text-center">ยกเลิก</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึกกิจกรรม 💾'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddActivityPage