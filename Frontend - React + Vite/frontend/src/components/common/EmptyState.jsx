import { motion } from 'framer-motion'

const EmptyState = ({ icon = '🏃', title = 'ไม่พบข้อมูล', description = '', action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action && action}
    </motion.div>
  )
}

export default EmptyState