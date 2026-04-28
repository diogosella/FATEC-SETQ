import UnavailablePage from './pages/unavailablePage'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import LoginPage from './pages/loginPage';
import SignUp from './pages/signupPage';
import Disabled from './pages/disabledPage';
import Teams from './pages/teamsPage';
import PrivateRoute from './PrivateRoute';
import MatchesPage from './pages/matchesPage';
import ForgotPassword from './pages/forgotPage';
import ConfigUser from './pages/configPage'

function App() {

  const navigate = useNavigate()

  useEffect(() => {
    const checkWeekend = () => {
      const hoje = new Date().getDay()

      // 0 = domingo | 6 = sábado
      if (hoje === 0 || hoje === 6) {
        navigate('/offline')
      }
    }

    checkWeekend()

    const interval = setInterval(checkWeekend, 60000)

    return () => clearInterval(interval)
  }, [navigate])

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
        path='/teams'
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;