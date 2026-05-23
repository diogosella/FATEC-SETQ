import { useState, useEffect, useCallback } from 'react';
import { getFullTeams, declareWinner } from '../services/teams';
import type { FullTeam } from '../../backend/src/types/team';

const POLL_INTERVAL_MS = 4000;

export const useMatches = () => {
  const [fullTeams, setFullTeams] = useState<FullTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [declaring, setDeclaring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const data = await getFullTeams();
      setFullTeams(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      await fetchQueue();
      if (mounted) setLoading(false);
    };

    initialLoad();

    const interval = setInterval(() => {
      fetchQueue();
    }, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchQueue]);

  const teamA = fullTeams[0] ?? null;
  const teamB = fullTeams[1] ?? null;
  const queue = fullTeams.slice(2);

  const handleDeclareWinner = async (winner: 'A' | 'B') => {
    if (!teamA || !teamB) return;
    const winnerId = winner === 'A' ? teamA.team_id : teamB.team_id;
    const loserId = winner === 'A' ? teamB.team_id : teamA.team_id;

    setDeclaring(true);
    try {
      await declareWinner(winnerId, loserId);
      await fetchQueue();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao declarar vencedor');
    } finally {
      setDeclaring(false);
    }
  };

  return { teamA, teamB, queue, loading, declaring, error, handleDeclareWinner };
};
