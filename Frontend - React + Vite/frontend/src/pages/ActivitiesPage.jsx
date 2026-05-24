import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useActivities } from '../hooks/useActivities'
import ActivityCard from '../components/activities/ActivityCard'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'

const TYPES = ['ทั้งหมด','วิ่ง','เดิน','ปั่นจักรยาน','ว่ายน้ำ','เวทเทรนนิ่ง','ฟุตบอล','บาสเกตบอล','โยคะ','HIIT','อื่นๆ']

const ActivitiesPage = () => {
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)

  const { activities, loading, pagination, setParams, refetch, deleteActivity } = useActivities({
    page: 1, limit: 8
  })

  const handleFilter = () => {
    setPage(1)
    setParams({
      page: 1, limit: 8,
...(filterType && filterType !== 'ทั้งหมด' && { type: filterType }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    })
  }

  const handleReset = () => {
    setFilterType('')
    setSearch('')
    setStartDate('')
    setEndDate('')
    setPage(1)
    setParams({ page: 1, limit: 8 })
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteActivity(deleteId)
      setDeleteId(null)
    } finally {
      setDeleting(false)
    }
  }

  const handlePageChange = (p) => {
    setPage(p)
    setParams(prev => ({ ...prev, page: p }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">กิจกรรมทั้งหมด 🏃</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            ทั้งหมด {pagination.total} กิจกรรม
          </p>
        </div>
        <Link to="/activities/add" className="btn-primary whitespace-nowrap self-start sm:self-auto">
          + เพิ่มกิจกรรม
        </Link>
      </div>

      {/* Filter Card */}
      <div className="card space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหากิจกรรม..."
            className="input-field pl-10"
            onKeyDown={e => e.key === 'Enter' && handleFilter()}
          />
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t === 'ทั้งหมด' ? '' : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                (t === 'ทั้งหมด' && !filterType) || filterType === t
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label text-xs">จากวันที่</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex-1">
            <label className="label text-xs">ถึงวันที่</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleFilter} className="btn-primary py-3 px-5">
              ค้นหา
            </button>
            <button onClick={handleReset} className="btn-secondary py-3 px-5">
              รีเซต
            </button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard count={4} />
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon="🏃"
          title="ไม่พบกิจกรรม"
          description="ลองเปลี่ยนตัวกรองหรือเพิ่มกิจกรรมใหม่"
          action={
            <Link to="/activities/add" className="btn-primary">
              + เพิ่มกิจกรรม
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((a, i) => (
              <ActivityCard
                key={a._id}
                activity={a}
                index={i}
                onDelete={setDeleteId}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="btn-secondary py-2 px-4 disabled:opacity-40"
              >
                ← ก่อนหน้า
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-9 w-9 rounded-xl font-semibold text-sm transition-all ${
                      p === page
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
                className="btn-secondary py-2 px-4 disabled:opacity-40"
              >
                ถัดไป →
              </button>
            </div>
          )}
        </>
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

export default ActivitiesPage