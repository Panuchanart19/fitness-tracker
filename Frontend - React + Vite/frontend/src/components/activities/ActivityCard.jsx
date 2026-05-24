import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const typeEmoji = {
  'วิ่ง': '🏃', 'เดิน': '🚶', 'ปั่นจักรยาน': '🚴',
  'ว่ายน้ำ': '🏊', 'เวทเทรนนิ่ง': '🏋️', 'ฟุตบอล': '⚽',
  'บาสเกตบอล': '🏀', 'โยคะ': '🧘', 'HIIT': '🔥', 'อื่นๆ': '💪'
}

const ActivityCard = ({ activity, onDelete, index = 0 }) => {
  const { _id, activityType, duration, calories, date, note } = activity

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl flex-shrink-0">
            {typeEmoji[activityType] || '💪'}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{activityType}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Link
            to={`/activities/edit/${_id}`}
            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
          >
            ✏️
          </Link>
          <button
            onClick={() => onDelete(_id)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-sm">
          <span>⏱️</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{duration}</span>
          <span className="text-gray-400">นาที</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span>🔥</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{calories}</span>
          <span className="text-gray-400">kcal</span>
        </div>
        {note && (
          <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto truncate max-w-[120px]">
            📝 {note}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default ActivityCard