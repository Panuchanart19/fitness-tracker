import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { adminService } from '../services/adminService'
import ConfirmDialog from '../components/common/ConfirmDialog'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import { toast } from 'react-toastify'

const TYPE_EMOJI = {
  'วิ่ง':'🏃','เดิน':'🚶','ปั่นจักรยาน':'🚴','ว่ายน้ำ':'🏊',
  'เวทเทรนนิ่ง':'🏋️','ฟุตบอล':'⚽','บาสเกตบอล':'🏀',
  'โยคะ':'🧘','HIIT':'🔥','อื่นๆ':'💪'
}

const AdminActivitiesPage = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await adminService.getActivities({ page, limit: 10 })
      setActivities(data.activities)
      setPagination({ total: data.total, pages: data.pages })
    } catch { toast.error('โหลดข้อมูลไม่สำเร็จ') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await adminService.deleteActivity(deleteId)
      toast.success('ลบกิจกรรมสำเร็จ')
      setDeleteId(null)
      fetch()
    } catch { toast.error('ลบไม่สำเร็จ') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">จัดการกิจกรรม 📝</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ทั้งหมด {pagination.total} รายการ</p>
      </div>

      {loading ? (
        <SkeletonCard count={4} />
      ) : activities.length === 0 ? (
        <EmptyState icon="📝" title="ไม่มีกิจกรรม" />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['กิจกรรม', 'ผู้ใช้', 'เวลา', 'แคลอรี่', 'วันที่', 'ลบ'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => (
                <motion.tr
                  key={a._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{TYPE_EMOJI[a.activityType] || '💪'}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{a.activityType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 text-xs">{a.user?.username}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[120px]">{a.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{a.duration} นาที</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{a.calories} kcal</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(a.date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setDeleteId(a._id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-2 px-4 disabled:opacity-40">← ก่อนหน้า</button>
          <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
            {page} / {pagination.pages}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages} className="btn-secondary py-2 px-4 disabled:opacity-40">ถัดไป →</button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="ลบกิจกรรม"
        message="คุณแน่ใจหรือว่าต้องการลบกิจกรรมนี้?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminActivitiesPage