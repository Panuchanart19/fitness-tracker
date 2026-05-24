import { motion, AnimatePresence } from 'framer-motion'

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative card max-w-sm w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-secondary flex-1">
                ยกเลิก
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="btn-danger flex-1 disabled:opacity-50"
              >
                {loading ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog