import { useEffect, useState } from 'react'
import { supabase } from "../supabase.ts";
import type { Session, User } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  session: Session | null
  isAdmin: boolean
  loading: boolean
}

async function fetchIsAdmin(authId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('auth_id', authId)
    .maybeSingle()

  if (error || !data) return false
  return Boolean(data.is_admin)
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const applySession = async (newSession: Session | null) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        const admin = await fetchIsAdmin(newSession.user.id)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        applySession(newSession)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, session, isAdmin, loading }
}
