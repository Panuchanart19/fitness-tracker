import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">ตั้งค่า ⚙️</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ปรับแต่งการใช้งาน</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">🎨 การแสดงผล</h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">เปลี่ยนธีมเป็นโหมดมืด</p>
          </div>
          <ToggleSwitch enabled={isDark} onToggle={toggleTheme} />
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">👤 บัญชีของฉัน</h2>
        {[
          { label: 'Username', value: user?.username },
          { label: 'Email', value: user?.email },
          { label: 'Role', value: user?.role === 'admin' ? '👑 Admin' : '🏃 User' },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card border-red-100 dark:border-red-900/30">
        <h2 className="font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Zone อันตราย</h2>
        <button onClick={logout} className="btn-danger w-full">
          🚪 ออกจากระบบ
        </button>
      </motion.div>

      {/* App Info */}
      <div className="text-center text-xs text-gray-400 py-4 space-y-1">
        <p>💪 FitTracker v1.0.0</p>
        <p>Fitness Activity Tracker · © 2025</p>
      </div>
    </div>
  )
}

export default SettingsPage