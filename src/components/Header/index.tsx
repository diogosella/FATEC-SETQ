import './header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faGear, faUserShield, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import { useAuth } from '../../hooks/useAuth'
import { getMainCyclePagePath } from '../../utils/cyclePath'
import logo from "../../assets/images/white-logo.png"
import { useState } from 'react'

export default function Header() {
    const [open, setOpen] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)
    const navigate = useNavigate()
    const { user, isAdmin } = useAuth()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleConfig = () => {
        setOpen(!open)
        if (adminOpen) setAdminOpen(false)
    }

    const handleAdmin = () => {
        setAdminOpen(!adminOpen)
        if (open) setOpen(false)
    }

    const handleMyMatches = () => {
        navigate('/myMatches')
    }

    const closeAdminMenu = () => setAdminOpen(false)

    return (
        <>
            <div className="headerContainer">
                <Link to={getMainCyclePagePath()} className="logo" title="Ir para a página principal do ciclo">
                    <img className='logoIcon' src={logo} />
                    <p className='logoText'>FATEC SetQ</p>
                    {isAdmin && <span className='adminBadge'>ADMIN</span>}
                </Link>
                <div className="icons">
                    {user && (
                        <div className="myMatchesBtn">
                            <button onClick={handleMyMatches} title="Minhas partidas">
                                <FontAwesomeIcon className='myMatchesIcon' icon={faClockRotateLeft} />
                            </button>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="admin">
                            <button onClick={handleAdmin}>
                                <FontAwesomeIcon className='adminIcon' icon={faUserShield} />
                            </button>
                        </div>
                    )}
                    <div className="config">
                        <button onClick={handleConfig}>
                            <FontAwesomeIcon className='configIcon' icon={faGear} />
                        </button>
                    </div>
                    <div className="exit">
                        <button onClick={handleLogout}>
                            <FontAwesomeIcon className='exitIcon' icon={faRightFromBracket} />
                        </button>
                    </div>
                </div>
                {open && <div className='menu'>
                    <Link to={'../configUser'} className='configLink' state={{ config: 'password' }}>Mudar Senha</Link>
                    <Link to={'../configUser'} className='configLink' state={{ config: 'email' }}>Mudar Email</Link>
                </div>
                }
                {adminOpen && (
                    <div className='adminMenu'>
                        <p className='adminMenuTitle'>Navegação Admin</p>
                        <Link to={'/teams'} className='adminLink' onClick={closeAdminMenu}>Times (Inscrições)</Link>
                        <Link to={'/matches'} className='adminLink' onClick={closeAdminMenu}>Partidas</Link>
                        <Link to={'/disabled'} className='adminLink' onClick={closeAdminMenu}>Tela de Espera</Link>
                        <Link to={'/controller'} className='adminLink adminLinkController' onClick={closeAdminMenu}>Painel Controller</Link>
                    </div>
                )}
            </div>
        </>
    )
}
