import './resetPage.css'
import logo from '../../assets/images/logo-300.jpg'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabase"


export default function ResetPassword() {
    const [newPassword, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdatePassword = async () => {
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
            setError("Senha alterada com sucesso.")
            setTimeout(() => { setLoading(false), navigate("/") }, 1000)
        }
    }

    return (
        <div className="credentialsContainer">
            <div className="logoContainer">
                <img src={logo} alt="Logo SetQ" />
                <h1>FATEC SetQ</h1>
            </div>
            <div className="passwordContainer">
                <p className='textTitle'>Recuperar Senha</p>
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
        </div>
    )
}