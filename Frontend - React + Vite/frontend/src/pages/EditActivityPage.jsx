import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { activityService } from '../services/activityService'
import { toast } from 'react-toastify'
import Spinner from '../components/common/Spinner'

const TYPES = ['วิ่ง','เดิน','ปั่นจักรยาน','ว่ายน้ำ','เวทเทรนนิ่ง','ฟุตบอล','บาสเกตบอล','โยคะ','HIIT','อื่นๆ']
const TYPE_EMOJI = {
  'วิ่ง':'🏃','เดิน':'🚶','ปั่นจักรยาน':'🚴','ว่ายน้ำ':'🏊',
  'เวทเทรนนิ่ง':'🏋️','ฟุตบอล':'⚽','บาสเกตบอล':'🏀',
  'โยคะ':'🧘','HIIT':'🔥','อื่นๆ':'💪'
}

const EditActivityPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    activityType: '', duration: '', calories: '', date: '', note: ''
  })

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await activityService.getAll({ limit: 100 })
        const act = data.activities.find(a => a._id === id)
        if (!act) { toast.error('ไม่พบกิจกรรม'); navigate('/activities'); return }
        setForm({
          activityType: act.activityType,
          duration: act.duration,
          calories: act.calories,
          date: new Date(act.date).toISOString().split('T')[0],
          note: act.note || ''
        })
      } catch { toast.error('โหลดข้อมูลไม่สำเร็จ') }
      finally { setFetching(false) }
    }
    load()
  }, [id])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.activityType) return toast.error('กรุณาเลือกประเภทกิจกรรม')
    try {
      setLoading(true)
      await activityService.update(id, {
        ...form,
        duration: Number(form.duration),
        calories: Number(form.calories)
      })
      toast.success('แก้ไขกิจกรรมสำเร็จ!')
      navigate('/activities')
    } catch (err) {
      toast.error(err.response?.data?.message || 'แก้ไขไม่สำเร็จ')
    } finally { setLoading(false) }
  }

  if (fetching) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/activities" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="page-title">แก้ไขกิจกรรม ✏️</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">แก้ไขข้อมูลการออกกำลังกาย</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div>
            <label className="label">ประเภทกิจกรรม *</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
              {TYPES.map(type => (
                <button key={type} type="button"
                  onClick={() => setForm(p => ({ ...p, activityType: type }))}
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
              <input type="number" name="duration" value={form.duration}
                onChange={handleChange} min="1" className="input-field" />
            </div>
            <div>
              <label className="label">🔥 แคลอรี่ (kcal) *</label>
              <input type="number" name="calories" value={form.calories}
                onChange={handleChange} min="0" className="input-field" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label">📅 วันที่</label>
            <input type="date" name="date" value={form.date}
              onChange={handleChange}  className="input-field" />
          </div>

          {/* Note */}
          <div>
            <label className="label">📝 หมายเหตุ</label>
            <textarea name="note" value={form.note} onChange={handleChange}
              rows={3} className="input-field resize-none" placeholder="หมายเหตุ..." />
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/activities" className="btn-secondary flex-1 text-center">ยกเลิก</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข 💾'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditActivityPage