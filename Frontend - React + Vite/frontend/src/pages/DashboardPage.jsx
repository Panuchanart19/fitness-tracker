import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { activityService } from '../services/activityService'
import { useGoals } from '../hooks/useGoals'
import StatsCard from '../components/dashboard/StatsCard'
import GoalProgress from '../components/dashboard/GoalProgress'
import ActivityCard from '../components/activities/ActivityCard'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { toast } from 'react-toastify'

const DashboardPage = () => {
  const { user } = useAuth()
  const { goals } = useGoals()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoadingStats(true)
      const [statsRes, actRes] = await Promise.all([
        activityService.getStats(),
        activityService.getAll({ limit: 4, page: 1 })
      ])
      setStats(statsRes.data)
      setRecent(actRes.data.activities)
    } catch {
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoadingStats(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await activityService.remove(deleteId)
      toast.success('ลบกิจกรรมสำเร็จ')
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('ลบไม่สำเร็จ')
    } finally {
      setDeleting(false)
    }
  }

  const activeGoal = goals?.[0]

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-green-700 p-6 text-white shadow-lg"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-primary-100 text-sm font-medium mb-1">
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            สวัสดี, {user?.username}! 👋
          </h1>
          <p className="text-primary-100 text-sm">
            วันนี้คุณออกกำลังกายแล้วหรือยัง? มาเริ่มต้นกันเลย!
          </p>
          <Link to="/activities/add" className="inline-flex items-center gap-2 mt-4 bg-white text-primary-700 font-bold py-2.5 px-5 rounded-xl hover:bg-green-50 transition-all shadow-md hover:shadow-lg text-sm">
            + เพิ่มกิจกรรม
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {loadingStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-28">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon="🏃" label="กิจกรรมทั้งหมด" value={stats?.totals?.totalActivities} color="green" delay={0} />
          <StatsCard icon="🔥" label="แคลอรี่ทั้งหมด" value={stats?.totals?.totalCalories} unit="kcal" color="orange" delay={0.1} />
          <StatsCard icon="⏱️" label="เวลาออกกำลังกาย" value={stats?.totals?.totalDuration} unit="นาที" color="blue" delay={0.2} />
          <StatsCard icon="🎯" label="เป้าหมายสำเร็จ" value={activeGoal ? Math.round(activeGoal.progress?.calories ?? 0) : 0} unit="%" color="purple" delay={0.3} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">กิจกรรมล่าสุด</h2>
            <Link to="/activities" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>

          {loadingStats ? (
            <SkeletonCard count={3} />
          ) : recent.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="🏃"
                title="ยังไม่มีกิจกรรม"
                description="เริ่มบันทึกการออกกำลังกายกันเลย!"
                action={
                  <Link to="/activities/add" className="btn-primary">
                    + เพิ่มกิจกรรมแรก
                  </Link>
                }
              />
            </div>
          ) : (
            recent.map((a, i) => (
              <ActivityCard
                key={a._id}
                activity={a}
                index={i}
                onDelete={setDeleteId}
              />
            ))
          )}
        </div>

        {/* Goal Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">เป้าหมายวันนี้</h2>
            <Link to="/goals" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              จัดการ →
            </Link>
          </div>

          <div className="card">
            {activeGoal ? (
              <>
                <GoalProgress
                  icon="🔥" label="แคลอรี่"
                  current={activeGoal.current?.calories ?? 0}
                  target={activeGoal.targetCalories}
                  unit="kcal" color="primary"
                />
                <GoalProgress
                  icon="⏱️" label="เวลา"
                  current={activeGoal.current?.duration ?? 0}
                  target={activeGoal.targetDuration}
                  unit="นาที" color="blue"
                />
                <GoalProgress
                  icon="🏃" label="กิจกรรม"
                  current={activeGoal.current?.count ?? 0}
                  target={activeGoal.targetActivities}
                  unit="ครั้ง" color="orange"
                />
              </>
            ) : (
              <EmptyState
                icon="🎯"
                title="ยังไม่มีเป้าหมาย"
                description="ตั้งเป้าหมายเพื่อเพิ่มแรงจูงใจ"
                action={
                  <Link to="/goals" className="btn-primary text-sm py-2 px-4">
                    ตั้งเป้าหมาย
                  </Link>
                }
              />
            )}
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">ทางลัด ⚡</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/activities/add', icon: '➕', label: 'เพิ่มกิจกรรม' },
                { to: '/statistics', icon: '📊', label: 'ดูสถิติ' },
                { to: '/goals', icon: '🎯', label: 'เป้าหมาย' },
                { to: '/profile', icon: '👤', label: 'โปรไฟล์' },
              ].map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all text-gray-600 dark:text-gray-400"
                >
                  <span className="text-2xl">{l.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="ลบกิจกรรม"
        message="คุณแน่ใจหรือว่าต้องการลบกิจกรรมนี้? ไม่สามารถย้อนกลับได้"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export default DashboardPage