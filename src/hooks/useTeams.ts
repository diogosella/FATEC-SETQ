import { useState, useEffect } from 'react';
import { getTeams, joinTeam, getUserTeam, leaveTeam, createTeam, getTeamMembers, registerFullTeam, markTeamAsFull, getUserCurrentTeam } from '../services/teams';
import type { TeamWithMembers } from '../../backend/src/types/team';

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [userCurrentTeam, setUserCurrentTeam] = useState<TeamWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsData, teamId, currentTeam] = await Promise.all([
        getTeams(),
        getUserTeam(),
        getUserCurrentTeam()  
      ]);
      setTeams(teamsData);
      setUserTeamId(teamId);
      setUserCurrentTeam(currentTeam);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleJoinTeam = async (team_id: number) => {
    setJoining(team_id);
    try {
      await joinTeam(team_id);
      const members = await getTeamMembers(team_id);
      if (members.length === 6) {
        const team = teams.find(t => t.id === team_id);
        if (team) {
          await registerFullTeam(team_id, team.team_name);
          await markTeamAsFull(team_id);
        }
      }
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setJoining(null);
    }
  };

  const handleLeaveTeam = async () => {
    setLeaving(true);
    try {
      await leaveTeam();
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLeaving(false);
    }
  };

  const handleCreateTeam = async (teamName: string) => {
    try {
      await createTeam(teamName);
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return { teams, userTeamId, userCurrentTeam, loading, error, joining, leaving, handleJoinTeam, handleLeaveTeam, handleCreateTeam };
};