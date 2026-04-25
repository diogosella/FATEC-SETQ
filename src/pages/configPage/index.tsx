import './configPage.css'
import logo from '../../assets/images/logo-300.jpg'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabase"
import { useLocation } from 'react-router-dom'

export default function ConfigUser() {
    const location = useLocation()
    const config = location.state?.config || 'email'
    const [newEmail, setEmail] = useState("")
    const [newPassword, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateEmail = async () => {
        setError("")

        if (!newEmail.trim()) {
            setError('Preencha o campo corretamente')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            email: newEmail
        })

        if (error) {
            setError("Erro ao atualizar o email")
            setLoading(false)
        } else {
            setError("Verifique seu novo email para confirmar a alteração")
            setTimeout(() => { setLoading(false), navigate("/") }, 1000)
        }

    }

    const handleUpdatePassword = async () => {
        setError("")
        
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError('Preencha ambos os campos')
            return
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem.")
            return
        }

        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            setError("Erro ao atualizar senha.")
            setLoading(false)
        } else {
            setError("Senha atualizada com sucesso.")
            setTimeout(() => { setLoading(false), navigate("/") }, 1000)
        }
    }

    return (
        <div className="credentialsContainer">
            <div className="logoContainer">
                <img src={logo} alt="Logo SetQ" />
                <h1>FATEC SetQ</h1>
            </div>
            {config === 'password' &&
                <div className="configContainer">
                    <p className='textTitle'>Configurar Senha</p>
                    <p>Digite sua nova senha</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="password" className='inputArea' placeholder="Nova senha" value={newPassword} onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" className='inputArea' placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button className='mainButton' onClick={handleUpdatePassword} disabled={loading}>
                            {loading ? (<img src="src\assets\images\loading.gif" className="loading"></img>) : ("Salvar Senha")}
                        </button>
                    </form>
                    {error && <p>{error}</p>}
                </div>
            }
            {config === 'email' &&
                <div className="configContainer">
                    <p className='textTitle'>Configurar Email</p>
                    <p>Digite seu novo email</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="email" className='inputArea' placeholder="Novo email" value={newEmail} onChange={(e) => setEmail(e.target.value)} />
                        <button className='mainButton' onClick={handleUpdateEmail} disabled={loading}>
                            {loading ? (<img src="src\assets\images\loading.gif" className="loading"></img>) : ("Salvar Email")}
                        </button>
                    </form>
                    {error && <p>{error}</p>}
                </div>
            }
        </div>
    )
}