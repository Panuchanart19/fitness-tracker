import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { adminService } from '../services/adminService'
import ConfirmDialog from '../components/common/ConfirmDialog'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import { toast } from 'react-toastify'

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await adminService.getUsers({ search, page, limit: 10 })
      setUsers(data.users)
      setPagination({ total: data.total, pages: data.pages })
    } catch { toast.error('โหลดข้อมูลไม่สำเร็จ') }
    finally { setLoading(false) }
  }, [search, page])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await adminService.deleteUser(deleteId)
      toast.success('ลบผู้ใช้งานสำเร็จ')
      setDeleteId(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'ลบไม่สำเร็จ')
    } finally { setDeleting(false) }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="page-title">จัดการผู้ใช้งาน 👥</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          ทั้งหมด {pagination.total} คน
        </p>
      </div>

      {/* Search */}
      <div className="card p-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="ค้นหา username หรือ email..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* User Cards — Mobile Friendly */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="ไม่พบผู้ใช้งาน" />
      ) : (
        <div className="space-y-3">
          {users.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                      {u.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {u.role === 'admin' ? '👑 Admin' : '🏃 User'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                {u.role !== 'admin' && (
                  <button
                    onClick={() => setDeleteId(u._id)}
                    className="flex-shrink-0 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 py-2">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
          >
            ← ก่อนหน้า
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium px-2">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === pagination.pages}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
          >
            ถัดไป →
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="ลบผู้ใช้งาน"
        message="คุณแน่ใจหรือว่าต้องการลบผู้ใช้งานนี้? ข้อมูลและกิจกรรมทั้งหมดจะถูกลบ"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminUsersPage