import { motion } from 'framer-motion'

const GoalProgress = ({ label, current, target, unit, icon, color = 'primary' }) => {
  const percent = Math.min(Math.round((current / target) * 100), 100)
  const isAchieved = percent >= 100

  const barColors = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {current}/{target} {unit}
          </span>
          <span className={`text-sm font-bold ${isAchieved ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {percent}% {isAchieved && '✅'}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColors[color]} ${isAchieved ? 'bg-green-500' : ''}`}
        />
      </div>
    </div>
  )
}

export default GoalProgress