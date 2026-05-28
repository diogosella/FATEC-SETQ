import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import './controller.css'
import Header from '../../components/Header'
import { forceCloseCurrentCycle } from '../../services/teams'

type Mode = 'open' | 'waiting' | 'offline' | 'automatic'
type PendingAction =
    | { type: 'mode'; mode: Mode }
    | { type: 'forceClose' }
    | null

const modeLabels: Record<Mode, string> = {
    open: 'Disponível',
    waiting: 'Esperando',
    offline: 'Indisponível',
    automatic: 'Automático',
}

export default function ControllerPage() {
    const [pending, setPending] = useState<PendingAction>(null)
    const [success, setSuccess] = useState<{ title: string; description: string } | null>(null)
    const [running, setRunning] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const askMode = (mode: Mode) => {
        setSuccess(null)
        setError(null)
        setPending({ type: 'mode', mode })
    }

    const askForceClose = () => {
        setSuccess(null)
        setError(null)
        setPending({ type: 'forceClose' })
    }

    const cancel = () => {
        if (running) return
        setPending(null)
    }

    const closeSuccess = () => setSuccess(null)

    const confirm = async () => {
        if (!pending) return
        setError(null)

        if (pending.type === 'mode') {
            const label = modeLabels[pending.mode]
            localStorage.setItem('systemMode', pending.mode)
            setPending(null)
            setSuccess({
                title: 'Alterado com sucesso',
                description: `Modo agora é ${label}.`,
            })
            return
        }

        setRunning(true)
        try {
            const { period, date } = await forceCloseCurrentCycle()
            setPending(null)
            setSuccess({
                title: 'Ciclo encerrado',
                description: `Ciclo ${period} de ${date} foi processado. Times que jogaram foram removidos; os demais foram transferidos para o próximo dia útil.`,
            })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao encerrar ciclo')
        } finally {
            setRunning(false)
        }
    }

    const modalOpen = pending !== null || success !== null

    const renderConfirmBody = () => {
        if (!pending) return null

        if (pending.type === 'mode') {
            return (
                <p className="confirmText">
                    Mudar para o modo <strong>{modeLabels[pending.mode]}</strong>?
                </p>
            )
        }

        return (
            <>
                <p className="confirmText">
                    Forçar o encerramento do ciclo atual <strong>agora</strong>?
                </p>
                <p className="confirmText confirmWarning">
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Times que não jogaram serão transferidos. Times que jogaram serão deletados.
                </p>
            </>
        )
    }

    return (
        <div className="contentContainer">
            <Header />

            <div className="controllerContainer">
                <h1 className="controllerTitle">
                    Painel Controller
                </h1>

                <button onClick={() => askMode('open')}>
                    Disponível
                </button>

                <button onClick={() => askMode('waiting')}>
                    Esperando
                </button>

                <button onClick={() => askMode('offline')}>
                    Indisponível
                </button>

                <button onClick={() => askMode('automatic')}>
                    Automático
                </button>

                <button
                    className="forceCloseButton"
                    onClick={askForceClose}
                >
                    Forçar fim de ciclo
                </button>
            </div>

            {modalOpen && (
                <>
                    <div
                        className="confirmOverlay"
                        onClick={success ? closeSuccess : cancel}
                    ></div>
                    <div className="confirmModal">
                        {pending && (
                            <>
                                <div className="confirmHeadline">
                                    <h2 className="confirmTitle">
                                        {pending.type === 'mode' ? 'Confirmar mudança' : 'Confirmar encerramento'}
                                    </h2>
                                    <button
                                        className="confirmCloseButton"
                                        onClick={cancel}
                                        disabled={running}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>

                                {renderConfirmBody()}

                                {error && (
                                    <p className="confirmText confirmWarning">{error}</p>
                                )}

                                <div className="confirmActions">
                                    <button
                                        className="confirmCancelButton"
                                        onClick={cancel}
                                        disabled={running}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="confirmOkButton"
                                        onClick={confirm}
                                        disabled={running}
                                    >
                                        {running ? 'Processando...' : 'Confirmar'}
                                    </button>
                                </div>
                            </>
                        )}

                        {success && (
                            <div className="confirmSuccess">
                                <FontAwesomeIcon icon={faCircleCheck} className="confirmSuccessIcon" />
                                <h2 className="confirmTitle">{success.title}</h2>
                                <p className="confirmText">{success.description}</p>
                                <div className="confirmActions confirmActionsCentered">
                                    <button
                                        className="confirmOkButton"
                                        onClick={closeSuccess}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
