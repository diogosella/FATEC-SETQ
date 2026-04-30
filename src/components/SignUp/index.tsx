import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/auth";
import type { Dispatch, SetStateAction } from "react";

export type User = {
  name: string,
  email: string,
  password: string,
}

type SignUpProps = {
  setUser: Dispatch<SetStateAction<User | null>>;
};

export default function Register({ setUser }: SignUpProps) {
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    setError(null)

    if (!email || !password) {
      setError('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
    const { user } = await signUp(email, password, name);
    setUser(user ? { name: user.user_metadata.name, email: user.email!, password: '' } : null);

      alert('Um e-mail de confirmação foi enviado ao endereço cadastrado! Confirme seu e-mail para realizar o login')

      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro ao cadastrar')
      }
    }
  }



    return (
        <div className="signinInputContainer">
            <p className='textTitle'>Criar conta</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <p className='formLabel'>Nome Completo</p>
                <input type="text" className='inputArea' placeholder="Insira seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required/>
                <p className='formLabel'>E-mail</p>
                <input type="text" className='inputArea' placeholder="Insira seu Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <p className='formLabel'>Senha</p>
                <input type="password" className='inputArea' placeholder="Insira sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <p className='formLabel'>Confirmar senha</p>
                <input type="password" className='inputArea' placeholder="Repita sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                <button className='mainButton' onClick={handleRegister}>Cadastrar</button>
            </form>
                {error && <p>Erro ao cadastrar, tente novamente mais tarde</p>}
                <Link to={'/'} className='secondaryButton'>Ja tenho conta</Link>
        </div>  
    ) 
}