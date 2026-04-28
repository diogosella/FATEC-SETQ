import './passwordPage.css'
import logo from '../../assets/images/logo-300.jpg'
import { useState } from 'react'
import { supabase } from "../../supabase.ts"

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/resetPassword"
        })

        if (error) {
            setError("Erro ao enviar email.")
        } else {
            setError("Se o email estiver cadastrado, enviamos o link de recuperação de senha.")
        }

        setLoading(false)
    }

    return (
        <div className="credentialsContainer">
            <div className="logoContainer">
                <img src={logo} alt="Logo SetQ" />
                <h1>FATEC SetQ</h1>
            </div>
            <div className="passwordContainer">
                <p className='textTitle'>Recuperar Senha</p>
                <p className='recoverTitle'>Insira seu email cadastrado para recuperar sua senha</p>
                <form onSubmit={(e) => e.preventDefault()}>
                    <p className='formLabel'>E-mail</p>
                    <input type="email" className='inputArea' placeholder="Insira seu Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </form>
                <button className='mainButton' onClick={handleReset} disabled={loading}>
                    {loading ? (<img src="src\assets\images\loading.gif" className="loading"></img>) : ("Enviar")}
                </button>
                {error && <p className='errorMessage'>{error}</p>}
            </div>
        </div>
    )
}