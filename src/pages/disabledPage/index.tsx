import './disabledPage.css'
import Header from '../../components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function calcularTempo(): string {
    const agora = new Date()
    const minutos = agora.getHours() * 60 + agora.getMinutes()

    const h1430 = 14 * 60 + 30
    const h1500 = 15 * 60
    const h2030 = 20 * 60 + 30
    const h2100 = 21 * 60

    const alvo = new Date()

    if (minutos < h1430) {
        alvo.setHours(14, 30, 0)
    } else if (minutos < h1500) {
        alvo.setHours(20, 30, 0)
    } else if (minutos < h2030) {
        alvo.setHours(20, 30, 0)
    } else if (minutos < h2100) {
        alvo.setDate(alvo.getDate() + 1)
        alvo.setHours(14, 30, 0)
    } else {
        alvo.setDate(alvo.getDate() + 1)
        alvo.setHours(14, 30, 0)
    }

    const diff = alvo.getTime() - agora.getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
    )
}

export default function Disabled() {

    const [timer, setTimer] = useState<string>(() => calcularTempo())
    const navigate = useNavigate()


    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(calcularTempo())
        }, 1000)

        return () => clearInterval(interval)
    }, [])


    useEffect(() => {

        const interval = setInterval(() => {

            const agora = new Date()
            const minutos = agora.getHours() * 60 + agora.getMinutes()

            const h1430 = 14 * 60 + 30
            const h1540 = 15 * 60 + 40

            const h2030 = 20 * 60 + 30
            const h2140 = 21 * 60 + 40

            const horarioAberto =
                (minutos >= h1430 && minutos < h1540) ||
                (minutos >= h2030 && minutos < h2140)

            if (horarioAberto) {
                navigate('/teams')
            }

        }, 1000)

        return () => clearInterval(interval)

    }, [navigate])

    return (
        <div className="pageContainer">
            <Header/>        

            <div className="closedSign">
                <FontAwesomeIcon icon={faClock} className='closedIcon'/>
                <p className='closedText'>Inscrições fechadas</p>
            </div>

            <div className="closedSubtitle">
                <p className='closedInfo'>
                    As inscrições abrem <span>30 minutos</span> antes do horário do intervalo
                </p>
                <p className='breakHours'>
                    Vespertino: 14:30 | Noturno: 20:30
                </p>
            </div>

            <div className="closedTimer">
                <p className='timerTitle'>Próxima abertura em</p>
                <span className='timer'>{timer}</span>
            </div>

        </div>
    )
}