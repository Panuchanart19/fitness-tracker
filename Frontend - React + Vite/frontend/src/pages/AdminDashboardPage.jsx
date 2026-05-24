import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminService } from '../services/adminService'
import StatsCard from '../components/dashboard/StatsCard'
import Spinner from '../components/common/Spinner'
import { toast } from 'react-toastify'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminService.getStats()
        setStats(data)
      } catch { toast.error('โหลดข้อมูลไม่สำเร็จ') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-gray-900 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-purple-200 text-sm font-medium mb-1">Admin Panel 👑</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">ภาพรวมระบบ</h1>
          <p className="text-purple-200 text-sm">จัดการผู้ใช้งานและกิจกรรมทั้งหมด</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon="👥" label="ผู้ใช้งานทั้งหมด" value={stats?.totalUsers} color="purple" />
        <StatsCard icon="🏃" label="กิจกรรมทั้งหมด" value={stats?.totalActivities} color="green" />
        <StatsCard icon="🔥" label="แคลอรี่รวม" value={stats?.totalCalories} unit="kcal" color="orange" className="col-span-2 lg:col-span-1" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: '/admin/users', icon: '👥', label: 'จัดการผู้ใช้งาน', desc: `${stats?.totalUsers} คน`, color: 'blue' },
          { to: '/admin/activities', icon: '📝', label: 'จัดการกิจกรรม', desc: `${stats?.totalActivities} รายการ`, color: 'green' },
        ].map(a => (
          <Link key={a.to} to={a.to}>
            <motion.div
              whileHover={{ y: -2 }}
              className="card hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-3xl flex-shrink-0">
                  {a.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{a.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </div>
                <svg className="h-5 w-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      {stats?.recentUsers?.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">👥 ผู้ใช้ล่าสุด</h2>
            <Link to="/admin/users" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map(u => (
              <div key={u._id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="h-9 w-9 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{u.username}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(u.createdAt).toLocaleDateString('th-TH')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage