import './header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import logo from "../../assets/images/white-logo.png"
import { useState } from 'react'

export default function Header() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleConfig = () => {
        setOpen(!open)
    }

    return (
        <>
            <div className="headerContainer">
                <div className="logo">
                    <img className='logoIcon' src={logo} />
                    <p className='logoText'>FATEC SetQ</p>
                </div>
                <div className="icons">
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
                    <Link to={'../configUser?config=password'} className='configLink'>Mudar Senha</Link>
                    <Link to={'../configUser?config=email'} className='configLink'>Mudar Email</Link>
                </div>
                }
            </div>
        </>
    )
}