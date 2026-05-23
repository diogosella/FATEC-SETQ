import { useState } from 'react';
import Header from '../../components/Header';
import { useMatches } from '../../hooks/useMatches';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faA, faB, faVolleyball, faTrophy, faXmark, faUsers } from '@fortawesome/free-solid-svg-icons'
import './matchesPage.css';

export default function MatchesPage() {
    const { teamA, teamB, queue, loading, declaring, handleDeclareWinner } = useMatches();
    const { isAdmin } = useAuth();

    const [pendingWinner, setPendingWinner] = useState<'A' | 'B' | null>(null);

    const date = new Date();

    const openConfirm = (winner: 'A' | 'B') => setPendingWinner(winner);
    const closeConfirm = () => setPendingWinner(null);

    const confirmWinner = async () => {
        if (!pendingWinner) return;
        await handleDeclareWinner(pendingWinner);
        setPendingWinner(null);
    };

    const pendingTeamName =
        pendingWinner === 'A' ? teamA?.team_name :
        pendingWinner === 'B' ? teamB?.team_name :
        null;

    return (
        <div className="contentContainer">
            <Header />

            {loading ? (
                <img src="src\assets\images\loading.gif" className="loadingFull" />
            ) : (
                <>
                    
                    <div className="currentMatch">
                        <h1 className='matchupTitle'>Jogando agora</h1>
                        <div className="matchup">
                            <div className='TeamA'>
                                <FontAwesomeIcon icon={faA} className='faA' />
                                {teamA ? teamA.team_name : 'Aguardando time...'}
                            </div>
                            <span className="vs">VS</span>
                            <div className='TeamB'>
                                <FontAwesomeIcon icon={faB} className='faB' />
                                {teamB ? teamB.team_name : 'Aguardando time...'}
                            </div>
                        </div>

                        
                        {isAdmin && teamA && teamB && (
                            <div className="adminControls">
                                <p className="adminControlsTitle">
                                    <FontAwesomeIcon icon={faTrophy} /> Determinar vencedor
                                </p>
                                <div className="adminButtons">
                                    <button
                                        className="winnerButton winnerA"
                                        onClick={() => openConfirm('A')}
                                        disabled={declaring}
                                    >
                                        {`${teamA.team_name} venceu`}
                                    </button>
                                    <button
                                        className="winnerButton winnerB"
                                        onClick={() => openConfirm('B')}
                                        disabled={declaring}
                                    >
                                        {`${teamB.team_name} venceu`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    
                    <div className="teamsList">
                        <div className="queueHeader">
                            <h2 className='teamsListTitle'>
                                <FontAwesomeIcon icon={faUsers} className='queueHeaderIcon' />
                                Fila de times a jogar
                            </h2>
                            <p className='gameDay'>
                                {date.getDate().toString().padStart(2, '0')}/
                                {(date.getMonth() + 1).toString().padStart(2, '0')}/
                                {date.getFullYear()}
                            </p>
                            {queue.length > 0 && (
                                <span className='queueCount'>{queue.length} {queue.length === 1 ? 'time' : 'times'}</span>
                            )}
                        </div>
                        {queue.length === 0 ? (
                            <div className="noTeamsRegistered">
                                <FontAwesomeIcon icon={faVolleyball} className='faVolleyball' />
                                <p className='noTeamsRegisteredText'>Nenhum time aguardando</p>
                                <p className='noTeamsHint'>Times completos aparecerão aqui</p>
                            </div>
                        ) : (
                            <ul className="queueList">
                                {queue.map((team, index) => (
                                    <li
                                        key={team.id}
                                        className={`queueItem ${index === 0 ? 'queueItemNext' : ''}`}
                                        style={{ animationDelay: `${index * 0.08}s` }}
                                    >
                                        <span className="queuePosition">
                                            {index + 1}
                                        </span>
                                        <span className="queueTeamName">{team.team_name}</span>
                                        {index === 0 && (
                                            <span className="queueNextBadge">PRÓXIMO</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}

            
            {pendingWinner && pendingTeamName && (
                <>
                    <div className="confirmOverlay" onClick={closeConfirm}></div>
                    <div className="confirmModal">
                        <div className="confirmHeadline">
                            <h2 className="confirmTitle">Confirmar vencedor</h2>
                            <button
                                className="confirmCloseButton"
                                onClick={closeConfirm}
                                disabled={declaring}
                            >
                                <FontAwesomeIcon className="closeIcon" icon={faXmark} />
                            </button>
                        </div>
                        <p className="confirmText">
                            Deseja confirmar a vitória do time <strong>{pendingTeamName}</strong>?
                        </p>
                        <div className="confirmActions">
                            <button
                                className="confirmCancelButton"
                                onClick={closeConfirm}
                                disabled={declaring}
                            >
                                Cancelar
                            </button>
                            <button
                                className="confirmOkButton"
                                onClick={confirmWinner}
                                disabled={declaring}
                            >
                                {declaring
                                    ? (<img src="src\assets\images\loading.gif" className="loading" />)
                                    : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
