import { useState } from "react";
import Header from "../../components/Header";
import TeamComponent from "../../components/Teams/TeamComponent";
import { useTeams } from "../../hooks/useTeams";
import CreateTeam from "../../components/Teams/CreateTeam"; 
import './teamsPage.css'

export default function Teams() {
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    const { teams, loading, error, userTeamId, userCurrentTeam, joining, leaving, handleJoinTeam, handleLeaveTeam, handleCreateTeam } = useTeams();
    const availableTeams = teams.filter(team => !team.is_full);
    
    return (
        <div className="contentContainer">
            {createTeamOpen && (
                <>
                    <div className="overlay"></div>
                    <div className="createTeamComponent">                    
                        <CreateTeam setCreateTeam={setCreateTeamOpen} handleCreateTeam={handleCreateTeam} />
                    </div>
                </>
            )}
            <Header />
            <div className="teamsTitle">
                <h1 className="teamsText">Inscrições abertas</h1>
                <p className="teamsShift">Noturno (18:30 - 20:00)</p>
            </div>
            <div className="teamsSelection">
                <button 
                    className={userTeamId !== null ? "teamsButtonDisabled" : "teamsButton"}
                    onClick={() => setCreateTeamOpen(true)} disabled={userTeamId !== null}>
                    {userTeamId !== null ? "Você já está em um time" : "Criar time"}
                </button>
            </div>
<div className="teamsDisplay">

                {userCurrentTeam && (
                    
                    <div className="currentTeamDisplay">
            <TeamComponent
                teams={[userCurrentTeam]}
                loading={loading}
                error={error}
                userTeamId={userTeamId}
                handleJoinTeam={handleJoinTeam}
                handleLeaveTeam={handleLeaveTeam}
                joining={joining}
                leaving={leaving}
            />
        </div>
    )}

            <h1 className="availableTeams">
                TIMES ABERTOS
            </h1>
                <TeamComponent
                    teams={availableTeams.filter(team => team.id !== userCurrentTeam?.id)}
                    loading={loading}
                    error={error}
                    userTeamId={userTeamId}
                    handleJoinTeam={handleJoinTeam}
                    handleLeaveTeam={handleLeaveTeam}
                    joining={joining}
                    leaving={leaving}
                />
        </div>
        </div>
    )
}