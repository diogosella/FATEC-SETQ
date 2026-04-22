import './header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import logo from "../../assets/images/white-logo.png"


export default function Header() {

    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
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
                        <button>
                            <FontAwesomeIcon className='configIcon' icon={faGear} />
                        </button>
                    </div>
                    <div className="exit">
                        <button onClick={handleLogout}>
                            <FontAwesomeIcon className='exitIcon' icon={faRightFromBracket} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}