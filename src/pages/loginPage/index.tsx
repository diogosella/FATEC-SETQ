import './loginPage.css'
import Login from '../../components/Login/index.tsx'
import logo from '../../assets/images/logo-300.jpg'

export default function LoginPage() {
    return (
    <div className="credentialsContainer">
        <div className="logoContainer">
            <img src={logo} alt="Logo SetQ" />
            <h1>FATEC SetQ</h1>
        </div>
        <Login />
    </div>
    )
}