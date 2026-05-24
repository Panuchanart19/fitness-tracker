import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const RegisterPage = () => {
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    if (form.password.length < 6) return toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    if (form.password !== form.confirm) return toast.error('รหัสผ่านไม่ตรงกัน')
    try {
      setLoading(true)
      await register(form.username, form.email, form.password)
    } catch (err) {
      toast.error(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : 'weak'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card shadow-2xl border-0"
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏃</div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">สมัครสมาชิก</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">เริ่มติดตามสุขภาพของคุณวันนี้</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">👤 Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="ชื่อผู้ใช้งาน"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">📧 Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">🔒 รหัสผ่าน</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="input-field pr-12"
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
          {/* Password strength */}
          {form.password && (
            <div className="mt-2 flex gap-1">
              {['weak','medium','strong'].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${
                  (s === 'weak' && ['weak','medium','strong'].includes(strength)) ||
                  (s === 'medium' && ['medium','strong'].includes(strength)) ||
                  (s === 'strong' && strength === 'strong')
                    ? s === 'weak' ? 'bg-red-400' : s === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="label">🔒 ยืนยันรหัสผ่าน</label>
          <input
            type={showPass ? 'text' : 'password'}
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {form.confirm && form.confirm !== form.password && (
            <p className="text-xs text-red-500 mt-1">⚠️ รหัสผ่านไม่ตรงกัน</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-base mt-2">
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก 🎉'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        มีบัญชีแล้ว?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </motion.div>
  )
}

export default RegisterPage