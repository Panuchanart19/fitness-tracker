import { useState } from 'react'
import { motion } from 'framer-motion'
import { goalService } from '../services/goalService'
import { useGoals } from '../hooks/useGoals'
import GoalProgress from '../components/dashboard/GoalProgress'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { toast } from 'react-toastify'

const PRESETS = [
  { label: '🌱 เริ่มต้น', desc: 'สำหรับมือใหม่', calories: 300, duration: 30, activities: 1 },
  { label: '💪 ทั่วไป', desc: 'ออกกำลังกายสม่ำเสมอ', calories: 500, duration: 60, activities: 1 },
  { label: '🔥 เข้มข้น', desc: 'เผาผลาญจริงจัง', calories: 800, duration: 90, activities: 2 },
  { label: '🏆 โปร', desc: 'นักกีฬาจริงจัง', calories: 1200, duration: 120, activities: 2 },
]

const GoalsPage = () => {
  const { goals, loading, refetch } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    targetCalories: '500',
    targetDuration: '60',
    targetActivities: '1',
    period: 'daily'
  })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handlePreset = (preset) => {
    setForm(p => ({
      ...p,
      targetCalories: String(preset.calories),
      targetDuration: String(preset.duration),
      targetActivities: String(preset.activities),
    }))
    toast.info(`เลือก Preset: ${preset.label}`)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.targetCalories || !form.targetDuration) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    try {
      setSaving(true)
      await goalService.create({
        targetCalories: Number(form.targetCalories),
        targetDuration: Number(form.targetDuration),
        targetActivities: Number(form.targetActivities),
        period: form.period
      })
      toast.success('ตั้งเป้าหมายสำเร็จ! 🎯')
      setShowForm(false)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'บันทึกไม่สำเร็จ')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">เป้าหมาย 🎯</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">กำหนดเป้าหมายการออกกำลังกาย</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="btn-primary">
          {showForm ? 'ยกเลิก' : '+ ตั้งเป้าหมาย'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-2 border-primary-200 dark:border-primary-800"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🎯 ตั้งเป้าหมายใหม่
          </h2>

          {/* Presets */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              ⚡ เลือก Preset
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.targetCalories === String(preset.calories) &&
                    form.targetDuration === String(preset.duration)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{preset.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{preset.desc}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">
                    {preset.calories} kcal · {preset.duration} นาที
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">ช่วงเวลา</label>
              <select name="period" value={form.period} onChange={handleChange} className="input-field">
                <option value="daily">รายวัน</option>
                <option value="weekly">รายสัปดาห์</option>
                <option value="monthly">รายเดือน</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">🔥 แคลอรี่</label>
                <input type="number" name="targetCalories" value={form.targetCalories}
                  onChange={handleChange} placeholder="500" min="1" className="input-field" />
                <p className="text-xs text-gray-400 mt-1">kcal</p>
              </div>
              <div>
                <label className="label">⏱️ เวลา</label>
                <input type="number" name="targetDuration" value={form.targetDuration}
                  onChange={handleChange} placeholder="60" min="1" className="input-field" />
                <p className="text-xs text-gray-400 mt-1">นาที</p>
              </div>
              <div>
                <label className="label">🏃 กิจกรรม</label>
                <input type="number" name="targetActivities" value={form.targetActivities}
                  onChange={handleChange} placeholder="1" min="1" className="input-field" />
                <p className="text-xs text-gray-400 mt-1">ครั้ง</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                ยกเลิก
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'กำลังบันทึก...' : 'บันทึกเป้าหมาย 💾'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="ยังไม่มีเป้าหมาย"
          description="ตั้งเป้าหมายการออกกำลังกายเพื่อเพิ่มแรงจูงใจ"
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + ตั้งเป้าหมายแรก
            </button>
          }
        />
      ) : (
        goals.map((goal, i) => (
          <motion.div
            key={goal._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {goal.period === 'daily' ? '📅 รายวัน' : goal.period === 'weekly' ? '📆 รายสัปดาห์' : '🗓️ รายเดือน'}
              </span>
              <span className="text-2xl">
                {(goal.progress?.calories ?? 0) >= 100 ? '🏆' : '🎯'}
              </span>
            </div>

            <GoalProgress icon="🔥" label="แคลอรี่"
              current={goal.current?.calories ?? 0}
              target={goal.targetCalories} unit="kcal" color="primary" />
            <GoalProgress icon="⏱️" label="เวลาออกกำลังกาย"
              current={goal.current?.duration ?? 0}
              target={goal.targetDuration} unit="นาที" color="blue" />
            <GoalProgress icon="🏃" label="จำนวนกิจกรรม"
              current={goal.current?.count ?? 0}
              target={goal.targetActivities} unit="ครั้ง" color="orange" />

            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'เป้าแคลอรี่', value: `${goal.targetCalories} kcal` },
                { label: 'เป้าเวลา', value: `${goal.targetDuration} นาที` },
                { label: 'เป้ากิจกรรม', value: `${goal.targetActivities} ครั้ง` },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}

export default GoalsPage