import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import TeamComponent from "../../components/Teams/TeamComponent";
import { useTeams } from "../../hooks/useTeams";
import CreateTeam from "../../components/Teams/CreateTeam"; 
import './teamsPage.css'

export default function Teams() {

    const navigate = useNavigate()

    const [createTeamOpen, setCreateTeamOpen] = useState(false);

    const {
        teams,
        loading,
        error,
        userTeamId,
        userCurrentTeam,
        joining,
        leaving,
        handleJoinTeam,
        handleLeaveTeam,
        handleCreateTeam
    } = useTeams();

    const availableTeams = teams.filter(team => !team.is_full);

    useEffect(() => {

        const interval = setInterval(() => {

            const agora = new Date()
            const minutos = agora.getHours() * 60 + agora.getMinutes()

            const h1430 = 14 * 60 + 30
            const h1540 = 15 * 60 + 40

            const h2030 = 20 * 60 + 30
            const h2100 = 21 * 60
            const h2130 = 21 * 60 + 30

        const dentroDoHorario =
            (minutos >= h1430 && minutos < h1540) ||
            (minutos >= h2030 && minutos < h2100);


            if ((minutos >= h2100) && (minutos < h2130)) {
                navigate('/matches')
            } else if (!dentroDoHorario) {
                navigate('/disabled')
            }
        }, 1000)

        

        return () => clearInterval(interval)

    }, [navigate])

    return (
        <div className="contentContainer">

            {createTeamOpen && (
                <>
                    <div className="overlay"></div>
                    <div className="createTeamComponent">                    
                        <CreateTeam 
                            setCreateTeam={setCreateTeamOpen} 
                            handleCreateTeam={handleCreateTeam} 
                        />
                    </div>
                </>
            )}

            <Header />

            <div className="teamsTitle">
                <h1 className="teamsText">Inscrições abertas</h1>
                <p className="teamsShift">Vespertino: 14:30 | Noturno: 20:30</p>
            </div>

            <div className="teamsSelection">
                <button 
                    className={userTeamId !== null ? "teamsButtonDisabled" : "teamsButton"}
                    onClick={() => setCreateTeamOpen(true)} 
                    disabled={userTeamId !== null}
                >
                    {userTeamId !== null 
                        ? "Você já está em um time" 
                        : "Criar time"}
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