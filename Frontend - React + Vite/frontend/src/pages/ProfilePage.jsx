import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('info')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' })
  const [passForm, setPassForm] = useState({ password: '', confirm: '' })

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handlePassChange = e => setPassForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleUpdateInfo = async e => {
    e.preventDefault()
    if (!form.username || !form.email) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    try {
      setLoading(true)
      const { data } = await authService.updateProfile(form)
      updateUser(data)
      toast.success('อัปเดตข้อมูลสำเร็จ! ✅')
    } catch (err) {
      toast.error(err.response?.data?.message || 'อัปเดตไม่สำเร็จ')
    } finally { setLoading(false) }
  }

  const handleUpdatePass = async e => {
    e.preventDefault()
    if (passForm.password.length < 6) return toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    if (passForm.password !== passForm.confirm) return toast.error('รหัสผ่านไม่ตรงกัน')
    try {
      setLoading(true)
      await authService.updateProfile({ password: passForm.password })
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ! 🔒')
      setPassForm({ password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">โปรไฟล์ 👤</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">จัดการข้อมูลส่วนตัว</p>
      </div>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center gap-5"
      >
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold ${
            user?.role === 'admin'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          }`}>
            {user?.role === 'admin' ? '👑 Admin' : '🏃 User'}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {[{ key: 'info', label: '📋 ข้อมูลส่วนตัว' }, { key: 'password', label: '🔒 รหัสผ่าน' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Info Form */}
      {tab === 'info' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div>
              <label className="label">👤 Username</label>
              <input type="text" name="username" value={form.username}
                onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">📧 Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล 💾'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Password Form */}
      {tab === 'password' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <form onSubmit={handleUpdatePass} className="space-y-4">
            <div>
              <label className="label">🔒 รหัสผ่านใหม่</label>
              <input type="password" name="password" value={passForm.password}
                onChange={handlePassChange} placeholder="อย่างน้อย 6 ตัวอักษร" className="input-field" />
            </div>
            <div>
              <label className="label">🔒 ยืนยันรหัสผ่านใหม่</label>
              <input type="password" name="confirm" value={passForm.confirm}
                onChange={handlePassChange} placeholder="กรอกรหัสผ่านอีกครั้ง" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน 🔐'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  )
}

export default ProfilePage