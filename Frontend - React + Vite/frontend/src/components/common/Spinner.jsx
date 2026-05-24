import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  // ฟังก์ชันเช็กว่าเราอยู่หน้านั้นๆ อยู่ไหม เพื่อไฮไลต์ปุ่มสีเขียว
  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/activities', label: 'กิจกรรมส่วนตัว', icon: '🏃' },
    { path: '/statistics', label: 'สถิติวิเคราะห์', icon: '📈' },
    { path: '/goals', label: 'เป้าหมายของฉัน', icon: '🎯' },
    { path: '/profile', label: 'โปรไฟล์ส่วนตัว', icon: '👤' },
    { path: '/settings', label: 'ตั้งค่าระบบ', icon: '⚙️' },
  ]

  return (
    <>
      {/* Sidebar ฝั่ง Desktop */}
      <aside className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-gray-300 border-r border-gray-800 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
          
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">เมนูผู้ใช้งาน</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive(item.path) ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* 👑 👑 👑 🛡️ แผงควบคุมตรวจจับสิทธิ์พาวเวอร์แอดมิน 👑 👑 👑 */}
            {user?.role === 'admin' && (
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-1">
                <p className="px-4 text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">🛡️ แผงควบคุม ADMIN</p>
                
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin') ? 'bg-red-600 text-white' : 'hover:bg-red-950/30 text-gray-400 hover:text-red-400'}`}
                >
                  <span>👑</span> แดชบอร์ดแอดมิน
                </Link>

                <Link
                  to="/admin/users"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin/users') ? 'bg-red-600 text-white' : 'hover:bg-red-950/30 text-gray-400 hover:text-red-400'}`}
                >
                  <span>👥</span> จัดการบัญชีผู้ใช้ (ลบ/ดู)
                </Link>

                <Link
                  to="/admin/activities"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin/activities') ? 'bg-red-600 text-white' : 'hover:bg-red-950/30 text-gray-400 hover:text-red-400'}`}
                >
                  <span>🏋️‍♂️</span> จัดการกิจกรรมกลาง
                </Link>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-600 pt-4 border-t border-gray-800">
            © 2026 FitTracker System
          </div>
        </div>
      </aside>

      {/* ม่านดำบังตาเวลาเปิดในมือถือ */}
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-10 bg-black/50 lg:hidden" />}
    </>
  )
}

export default Sidebar