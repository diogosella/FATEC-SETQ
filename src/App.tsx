import ControllerPage from './pages/controllerPage'
import UnavailablePage from './pages/unavailablePage'
import LoginPage from './pages/loginPage'

import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import SignUp from './pages/signupPage'
import Disabled from './pages/disabledPage'
import Teams from './pages/teamsPage'
import PrivateRoute from './PrivateRoute'
import MatchesPage from './pages/matchesPage'
import ForgotPassword from './pages/forgotPage'
import ConfigUser from './pages/configPage'
import MyMatchesPage from './pages/myMatchesPage'

function App() {

  const systemMode = localStorage.getItem('systemMode')

  const location = useLocation()

  const freePages = [
  '/',
  '/controller',
  '/myMatches',
  '/configUser',
  '/forgotPassword',
  '/matches'
]

const isFreePage = freePages.includes(location.pathname)

 if (!isFreePage)  {

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

    
      <Route path='/controller' element={<ControllerPage />} />

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