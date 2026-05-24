import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

const userLinks = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/activities', icon: '🏃', label: 'กิจกรรม' },
  { to: '/statistics', icon: '📊', label: 'สถิติ' },
  { to: '/goals', icon: '🎯', label: 'เป้าหมาย' },
  { to: '/profile', icon: '👤', label: 'โปรไฟล์' },
  { to: '/settings', icon: '⚙️', label: 'ตั้งค่า' },
]

const adminLinks = [
  { to: '/admin', icon: '📋', label: 'Admin Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'จัดการผู้ใช้' },
  { to: '/admin/activities', icon: '📝', label: 'จัดการกิจกรรม' },
]

const SidebarContent = ({ links, user, onLinkClick }) => (
  <div className="flex flex-col h-full">
    <div className="p-6 hidden lg:block">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💪</span>
        <div>
          <p className="font-bold text-primary-600 dark:text-primary-400 text-lg leading-none">FitTracker</p>
          <p className="text-xs text-gray-400">Fitness Activity Tracker</p>
        </div>
      </div>
    </div>

    <div className="mx-4 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 mb-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.username}</p>
          <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {links.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin' || to === '/dashboard'}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
            ${isActive
              ? 'bg-primary-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="p-4 text-center text-xs text-gray-400">
      <p>© 2025 FitTracker</p>
    </div>
  </div>
)

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const links = user?.role === 'admin' ? adminLinks : userLinks

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30">
        <SidebarContent links={links} user={user} />
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 h-full w-72 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">💪 FitTracker</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            ✕
          </button>
        </div>
        <SidebarContent links={links} user={user} onLinkClick={onClose} />
      </motion.aside>
    </>
  )
}

export default Sidebar