import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './hooks/useAuth'

type Props = {
  children: ReactNode
}

export default function AdminRoute({ children }: Props) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="contentContainer">
        <img src="src\assets\images\loading.gif" className="loadingFull" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/teams" replace />
  }

  return <>{children}</>
}
