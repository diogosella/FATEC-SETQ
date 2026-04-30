import './unavailablePage.css'
import Header from '../../components/Header'
import logo from '../../assets/images/logo-300.jpg'

export default function UnavailablePage() {
    return (
        <div className="pageContainer unavailableBg">
            
            <Header/>

            <div className="closedSign">
                <img src={logo} className="unavailableLogo" />

                <p className='closedText'>
                    Ops, o SetQ está indisponível hoje
                </p>
            </div>

            <div className="closedSubtitle">
                <p className='closedInfo'>
                    Funcionamos de <span>segunda a sexta</span>
                </p>

                <p className='breakHours'>
                    Caso queira usar em um evento próprio, entre em contato
                </p>

                <a href='' className='contact'>
                    Entrar no grupo do whatsapp
                </a>
            </div>

        </div>
    )
}