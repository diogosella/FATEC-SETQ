import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './hooks/useAuth'

type Props = {
  children: ReactNode
}

export default function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <p>Carregando...</p>

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}