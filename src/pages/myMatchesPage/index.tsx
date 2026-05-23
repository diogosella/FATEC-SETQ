import Header from '../../components/Header';
import { useMyMatches } from '../../hooks/useMyMatches';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFlag, faVolleyball, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import './myMatchesPage.css';

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${dd}/${mm} • ${hh}:${min}`;
};

export default function MyMatchesPage() {
    const { matches, wins, losses, loading, error } = useMyMatches();

    return (
        <div className="contentContainer">
            <Header />

            <div className="myMatchesHeader">
                <h1 className="myMatchesTitle">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="myMatchesTitleIcon" />
                    Minhas partidas
                </h1>
                <p className="myMatchesSubtitle">Histórico das suas partidas</p>
            </div>

            <div className="myStatsRow">
                <div className="myStatCard myStatWins">
                    <FontAwesomeIcon icon={faTrophy} className="myStatIcon" />
                    <div className="myStatNumber">{wins}</div>
                    <div className="myStatLabel">{wins === 1 ? 'Vitória' : 'Vitórias'}</div>
                </div>
                <div className="myStatCard myStatLosses">
                    <FontAwesomeIcon icon={faFlag} className="myStatIcon" />
                    <div className="myStatNumber">{losses}</div>
                    <div className="myStatLabel">{losses === 1 ? 'Derrota' : 'Derrotas'}</div>
                </div>
            </div>

            {loading ? (
                <img src="src\assets\images\loading.gif" className="loadingFull" />
            ) : error ? (
                <p className="myMatchesError">Erro ao carregar partidas: {error}</p>
            ) : matches.length === 0 ? (
                <div className="noMatches">
                    <FontAwesomeIcon icon={faVolleyball} className="noMatchesIcon" />
                    <p className="noMatchesText">Você ainda não jogou nenhuma partida</p>
                    <p className="noMatchesHint">Seu histórico aparecerá aqui</p>
                </div>
            ) : (
                <ul className="myMatchesList">
                    {matches.map((m, index) => {
                        const isWin = m.team_side === 'winner';
                        const myTeamName = isWin ? m.matches.winner_team_name : m.matches.loser_team_name;
                        const otherTeamName = isWin ? m.matches.loser_team_name : m.matches.winner_team_name;
                        return (
                            <li
                                key={m.matches.id}
                                className={`myMatchItem ${isWin ? 'myMatchWin' : 'myMatchLoss'}`}
                                style={{ animationDelay: `${index * 0.06}s` }}
                            >
                                <span className={`myMatchBadge ${isWin ? 'badgeWin' : 'badgeLoss'}`}>
                                    {isWin ? 'V' : 'D'}
                                </span>
                                <div className="myMatchBody">
                                    <div className="myMatchTeams">
                                        <span className="myMatchMyTeam">{myTeamName}</span>
                                        <span className="myMatchVs">vs</span>
                                        <span className="myMatchOther">{otherTeamName}</span>
                                    </div>
                                    <div className="myMatchMeta">{formatDateTime(m.matches.created_at)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
