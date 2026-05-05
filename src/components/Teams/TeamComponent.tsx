import "./TeamComponent.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import type { TeamWithMembers } from '../../../backend/src/types/team'

type TeamComponentProps = {
    teams: TeamWithMembers[];
    loading: boolean;
    error: string | null;
    userTeamId: number | null;
    joining: number | null;
    leaving: boolean;
    handleJoinTeam: (team_id: number) => Promise<void>;
    handleLeaveTeam: () => Promise<void>;
};

export default function TeamComponent({ teams, loading, error, userTeamId, joining, leaving, handleJoinTeam, handleLeaveTeam }: TeamComponentProps) {
    const slots = Array.from({ length: 6 });

    if (loading) return <img src="src\assets\images\loading.gif" className="loadingTeams" />;
    if (error) return <div>Erro ao cadastrar</div>;

    return (
        <>
            {teams.map((team, index) => {
                const members = team.user_team ?? [];
                const isJoiningThis = joining === team.id; 

                return (
                        <div key={team.id}
                        className={`displayBox ${userTeamId === team.id ? 'myTeamBox' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}>

                        {userTeamId === team.id && <span className="badge">SEU TIME</span> }
                        <h1 className="teamName">{team.team_name}</h1>
                        <ul className="displayMembers">
                            {slots.map((_, index) => {
                                const member = members[index];
                                return (
                                    <li key={index} className={member ? "filledSpot" : "freeSpot"}>
                                        {member ? member.users.name.split(' ').slice(0, 2).join(' ') : "Vaga aberta"}
                                    </li>
                                );
                            })}
                        </ul>
                        {userTeamId === team.id && <hr className="hrLine" />}
                        <div className="buttonContainer">
                            {userTeamId === team.id ? (
                                <div className="alreadyTeamedContainer">
                                    <span className="alreadyTeamed">Você está nesse time</span>
                                    <button
                                        className="leaveTeamButton"
                                        onClick={handleLeaveTeam}
                                        disabled={leaving}
                                    >
                                        {leaving
                                            ? (<img src="src\assets\images\loading.gif" className="loading"></img>)
                                            : <FontAwesomeIcon className="leaveIcon" icon={faRightFromBracket} />
                                        }
                                    </button>
                                </div>
                            ) : team.is_full ? (
                                <span className="fullTeamWarn">Time cheio</span>
                            ) : (
                                <button
                                    className="joinButton"
                                    onClick={() => handleJoinTeam(team.id)}
                                    disabled={userTeamId !== null || joining !== null} 
                                >
                                    {isJoiningThis ? (
                                        (<img src="src\assets\images\loading.gif" className="loading"></img>) 
                                    ) : (
                                        <>
                                            <FontAwesomeIcon className="joinIcon" icon={faArrowRightLong} />
                                            Entrar
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}