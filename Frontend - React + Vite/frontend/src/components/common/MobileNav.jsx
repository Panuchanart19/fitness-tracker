import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const userLinks = [
  { to: '/dashboard', icon: '🏠', label: 'หน้าหลัก' },
  { to: '/activities', icon: '🏃', label: 'กิจกรรม' },
  { to: '/statistics', icon: '📊', label: 'สถิติ' },
  { to: '/goals', icon: '🎯', label: 'เป้าหมาย' },
  { to: '/profile', icon: '👤', label: 'โปรไฟล์' },
]

const adminLinks = [
  { to: '/admin', icon: '📋', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'ผู้ใช้' },
  { to: '/admin/activities', icon: '📝', label: 'กิจกรรม' },
]

const MobileNav = () => {
  const { user } = useAuth()
  const links = user?.role === 'admin' ? adminLinks : userLinks

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-0.5 rounded-xl transition-all
              ${isActive
                ? 'text-primary-500'
                : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {icon}
                </span>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav