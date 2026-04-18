import { Link, useNavigate } from "react-router-dom";
import "../Login/login.css"
import { useState } from 'react'
import { signIn } from '../../services/auth.ts'

const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();

export default function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState<string>('')
const [password, setPassword] = useState<string>('')
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
        setLoading(true)
    await signIn(email, password)
          if ((hour == 14 && minute == 30) || (hour == 20 && minute == 30)) {
            navigate('/teams')
          }
          else if (hour == 15 || hour == 21) {
            navigate('/teams')
          } else {
            navigate('/disabled')
          }
    } catch (err) {
    if (err instanceof Error) {
        setError(err.message)
    } else {
        setError('Erro desconhecido')
    } 
    } finally {
        setLoading(false)
    } 
}

    return (
        <>
        <div className="loginInputContainer">
            <p className='textTitle'>Entrar</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <p className='formLabel'>E-mail</p>
                <input type="text" className='inputArea' placeholder="Insira seu Email"  value={email}  onChange={(e) => setEmail(e.target.value)} />
                <p className='formLabel'>Senha</p>
                <input type="password" className='inputArea' placeholder="Insira sua senha" value={password} onChange={(e) => setPassword(e.target.value) }/>
            </form>
                <button className='mainButton' onClick={handleLogin} disabled={loading}>
                   {loading ? (<img src="src\assets\images\loading.gif" className="loading"></img>) : ("Entrar")}
                    </button>
                {error && <p>{error}</p>}
            <Link to={'/signup'} className='secondaryButton'>Cadastrar</Link>
        </div>
        </>
    )
}