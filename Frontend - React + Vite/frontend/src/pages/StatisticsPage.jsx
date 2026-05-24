import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { activityService } from '../services/activityService'
import CaloriesChart from '../components/charts/CaloriesChart'
import DurationChart from '../components/charts/DurationChart'
import PopularChart from '../components/charts/PopularChart'
import StatsCard from '../components/dashboard/StatsCard'
import Spinner from '../components/common/Spinner'
import { toast } from 'react-toastify'

const StatisticsPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await activityService.getStats()
        setStats(data)
      } catch { toast.error('โหลดสถิติไม่สำเร็จ') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">สถิติ 📊</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          ข้อมูลการออกกำลังกายของคุณ
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon="🏃" label="กิจกรรมทั้งหมด"
          value={stats?.totals?.totalActivities} color="green" />
        <StatsCard icon="🔥" label="แคลอรี่รวม"
          value={stats?.totals?.totalCalories} unit="kcal" color="orange" />
        <StatsCard icon="⏱️" label="เวลารวม"
          value={stats?.totals?.totalDuration} unit="นาที" color="blue"
          className="col-span-2 lg:col-span-1" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Calories Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🔥 แคลอรี่รายวัน (7 วันล่าสุด)
          </h2>
          {stats?.dailyStats?.length > 0 ? (
            <CaloriesChart data={stats.dailyStats} />
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              ไม่มีข้อมูล
            </div>
          )}
        </motion.div>

        {/* Duration Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            ⏱️ เวลาออกกำลังกาย (7 วันล่าสุด)
          </h2>
          {stats?.dailyStats?.length > 0 ? (
            <DurationChart data={stats.dailyStats} />
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              ไม่มีข้อมูล
            </div>
          )}
        </motion.div>

        {/* Popular Doughnut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🏆 กิจกรรมยอดนิยม
          </h2>
          {stats?.popularActivities?.length > 0 ? (
            <div className="max-w-sm mx-auto">
              <PopularChart data={stats.popularActivities} />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              ไม่มีข้อมูล
            </div>
          )}
        </motion.div>
      </div>

      {/* Popular Activities Table */}
      {stats?.popularActivities?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card overflow-x-auto"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📋 รายการกิจกรรม
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">อันดับ</th>
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">กิจกรรม</th>
                <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">จำนวนครั้ง</th>
              </tr>
            </thead>
            <tbody>
              {stats.popularActivities.map((a, i) => (
                <tr key={a._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-2">
                    <span className={`font-bold text-lg ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-800 dark:text-gray-200">{a._id}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold px-3 py-1 rounded-full text-xs">
                      {a.count} ครั้ง
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}

export default StatisticsPage