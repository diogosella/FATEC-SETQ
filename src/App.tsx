import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SignUp from './pages/signupPage';
import Disabled from './pages/disabledPage';
import Teams from './pages/teamsPage';
import PrivateRoute from './PrivateRoute';
import MatchesPage from './pages/matchesPage';
import ForgotPassword from './pages/forgotPage';
import ResetPassword from './pages/resetPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/disabled' element={<Disabled />} />
      <Route path='/matches' element={<MatchesPage />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />
      <Route path='/resetPassword' element={<ResetPassword />} />

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