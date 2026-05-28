import './controller.css'

export default function ControllerPage() {

    const setMode = (mode: string) => {
        localStorage.setItem('systemMode', mode)

        alert(`Modo alterado para: ${mode}`)
    }

    return (
        <div className="controllerContainer">

            <h1 className="controllerTitle">
                Painel Controller
            </h1>

            <button onClick={() => setMode('open')}>
                Disponível
            </button>

            <button onClick={() => setMode('waiting')}>
                Esperando
            </button>

            <button onClick={() => setMode('offline')}>
                Indisponível
            </button>

            <button onClick={() => setMode('automatic')}>
                Automático
            </button>

        </div>
    )
}