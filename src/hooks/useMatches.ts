import { useState, useEffect, useCallback } from 'react';
import { getFullTeams, declareWinner, addAdminTeamToQueue } from '../services/teams';
import { registerMatchResult, getRecentResults } from '../services/matches';
import type { FullTeam } from '../../backend/src/types/team';
import type { MatchResult } from '../../backend/src/types/match';

const POLL_INTERVAL_MS = 4000;

export const useMatches = () => {
  const [fullTeams, setFullTeams] = useState<FullTeam[]>([]);
  const [recentResults, setRecentResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [declaring, setDeclaring] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [queueData, resultsData] = await Promise.all([
        getFullTeams(),
        getRecentResults(15),
      ]);
      setFullTeams(queueData);
      setRecentResults(resultsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      await fetchAll();
      if (mounted) setLoading(false);
    };

    initialLoad();

    const interval = setInterval(() => {
      fetchAll();
    }, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchAll]);

  const teamA = fullTeams[0] ?? null;
  const teamB = fullTeams[1] ?? null;
  const queue = fullTeams.slice(2);

  const handleDeclareWinner = async (winner: 'A' | 'B') => {
    if (!teamA || !teamB) return;
    const winnerTeam = winner === 'A' ? teamA : teamB;
    const loserTeam = winner === 'A' ? teamB : teamA;

    setDeclaring(true);
    try {
      await registerMatchResult(
        winnerTeam.team_id,
        loserTeam.team_id,
        winnerTeam.team_name,
        loserTeam.team_name
      );
      await declareWinner(winnerTeam.team_id, loserTeam.team_id);
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao declarar vencedor');
    } finally {
      setDeclaring(false);
    }
  };

  const handleAddTeamToQueue = async (team_name: string) => {
    setAdding(true);
    try {
      await addAdminTeamToQueue(team_name);
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar time');
      throw err;
    } finally {
      setAdding(false);
    }
  };

  return {
    teamA,
    teamB,
    queue,
    recentResults,
    loading,
    declaring,
    adding,
    error,
    handleDeclareWinner,
    handleAddTeamToQueue,
  };
};
