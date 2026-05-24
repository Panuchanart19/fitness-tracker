import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const NotFoundPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-8xl mb-6"
        >
          🏃
        </motion.div>
        <h1 className="text-8xl font-black text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          ไม่พบหน้าที่ต้องการ
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          หน้านี้อาจถูกลบหรือ URL ไม่ถูกต้อง
        </p>
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'}
          className="btn-primary inline-block"
        >
          🏠 กลับหน้าหลัก
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage