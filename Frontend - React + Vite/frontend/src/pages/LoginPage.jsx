import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    try {
      setLoading(true)
      await login(form.email, form.password)
    } catch (err) {
      toast.error(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card shadow-2xl border-0"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💪</div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">FitTracker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">เข้าสู่ระบบเพื่อเริ่มต้น</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">📧 Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input-field"
            autoComplete="email"
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
              placeholder="รหัสผ่าน 6 ตัวขึ้นไป"
              className="input-field pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-base mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              กำลังเข้าสู่ระบบ...
            </span>
          ) : 'เข้าสู่ระบบ 🚀'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        ยังไม่มีบัญชี?{' '}
        <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          สมัครสมาชิก
        </Link>
      </p>

      {/* Demo Account */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          🧪 Demo: admin@fit.com / 123456
        </p>
      </div>
    </motion.div>
  )
}

export default LoginPage