import ControllerPage from './pages/controllerPage'
import UnavailablePage from './pages/unavailablePage'
import LoginPage from './pages/loginPage'

import {
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useEffect } from 'react'

import SignUp from './pages/signupPage'
import Disabled from './pages/disabledPage'
import Teams from './pages/teamsPage'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import MatchesPage from './pages/matchesPage'
import ForgotPassword from './pages/forgotPage'
import ConfigUser from './pages/configPage'
import MyMatchesPage from './pages/myMatchesPage'
import { getMainCyclePagePath } from './utils/cyclePath'
import { useAuth } from './hooks/useAuth'

const FREE_PAGES = [
  '/',
  '/signup',
  '/forgotPassword',
  '/configUser',
  '/controller',
  '/myMatches',
]

const AUTO_REDIRECT_INTERVAL_MS = 5000

function App() {

  const systemMode = localStorage.getItem('systemMode')
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin, loading: authLoading } = useAuth()

  useEffect(() => {
    const shouldSkip = () =>
      authLoading ||
      isAdmin ||
      FREE_PAGES.includes(location.pathname)

    const checkCycle = () => {
      if (shouldSkip()) return
      const expected = getMainCyclePagePath()
      if (expected !== location.pathname) {
        navigate(expected, { replace: true })
      }
    }

    checkCycle()
    const interval = setInterval(checkCycle, AUTO_REDIRECT_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [location.pathname, navigate, isAdmin, authLoading])

  const isFreePage = FREE_PAGES.includes(location.pathname)

  if (!isFreePage && !isAdmin) {
    if (systemMode === 'offline') {
      return <UnavailablePage />
    }
    if (systemMode === 'waiting') {
      return <Disabled />
    }
    if (systemMode === 'open') {
      return <Teams />
    }
  }

  return (
    <Routes>
      <Route path="/offline" element={<UnavailablePage />} />
      <Route path='/' element={<LoginPage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/disabled' element={<Disabled />} />
      <Route path='/matches' element={<MatchesPage />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />
      <Route path='/configUser' element={<ConfigUser />} />

      <Route
        path='/controller'
        element={
          <AdminRoute>
            <ControllerPage />
          </AdminRoute>
        }
      />

      <Route
        path='/teams'
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />

      <Route
        path='/myMatches'
        element={
          <PrivateRoute>
            <MyMatchesPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
