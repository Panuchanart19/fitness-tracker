import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const features = [
  { icon: '🏃', title: 'บันทึกกิจกรรม', desc: 'บันทึกการออกกำลังกายได้หลากหลายประเภท' },
  { icon: '📊', title: 'ดูสถิติ', desc: 'กราฟวิเคราะห์ข้อมูลสุขภาพย้อนหลัง' },
  { icon: '🎯', title: 'ตั้งเป้าหมาย', desc: 'กำหนดเป้าหมายรายวันและติดตามความสำเร็จ' },
  { icon: '🔥', title: 'แคลอรี่', desc: 'ติดตามแคลอรี่ที่เผาผลาญในแต่ละวัน' },
  { icon: '📱', title: 'Responsive', desc: 'ใช้งานได้ทุกอุปกรณ์ทั้งมือถือและคอมพิวเตอร์' },
  { icon: '🌙', title: 'Dark Mode', desc: 'รองรับธีมมืดเพื่อถนอมสายตา' },
]

const activities = ['วิ่ง 🏃','เดิน 🚶','ปั่นจักรยาน 🚴','ว่ายน้ำ 🏊','เวทเทรนนิ่ง 🏋️','ฟุตบอล ⚽','โยคะ 🧘','HIIT 🔥']

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
            <span className="text-2xl">💪</span> FitTracker
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition-colors">
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary text-sm py-2 px-4">
                เข้าสู่ระบบ
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4 hidden sm:block">เข้าสู่ระบบ</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 pt-16">
        {/* BG Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8">
              <span className="animate-pulse">🟢</span> พร้อมใช้งานแล้ว
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              ติดตามการ
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                {' '}ออกกำลังกาย
              </span>
              <br />ของคุณ
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              แอปพลิเคชันสำหรับบันทึกและติดตามการออกกำลังกาย
              วิเคราะห์สถิติสุขภาพ และตั้งเป้าหมายเพื่อชีวิตที่ดีขึ้น
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-primary-700 font-bold py-4 px-8 rounded-2xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
              >
                เริ่มต้นฟรี 🚀
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all text-lg"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { value: '10+', label: 'ประเภทกิจกรรม' },
              { value: '24/7', label: 'ใช้งานได้ตลอด' },
              { value: '100%', label: 'ฟรีตลอดไป' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Activity Types */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              รองรับกิจกรรมหลากหลาย
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">บันทึกการออกกำลังกายได้มากกว่า 10 ประเภท</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {activities.map((act, i) => (
              <motion.div
                key={act}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-default"
              >
                {act}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ฟีเจอร์ครบครัน
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">ทุกสิ่งที่คุณต้องการในการติดตามสุขภาพ</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-white/80 text-lg mb-10">
              สมัครฟรีวันนี้ เริ่มติดตามสุขภาพของคุณได้เลย
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-primary-700 font-bold py-4 px-10 rounded-2xl hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
            >
              สมัครสมาชิกฟรี 💪
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="text-sm">© 2025 FitTracker · Fitness Activity Tracker · Made with ❤️</p>
      </footer>
    </div>
  )
}

export default LandingPage