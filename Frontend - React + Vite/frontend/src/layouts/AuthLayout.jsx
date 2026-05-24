import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/common/Spinner'

const AuthLayout = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Spinner fullScreen />
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout