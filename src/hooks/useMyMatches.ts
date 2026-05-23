import { useEffect, useState } from 'react';
import { getMyMatches } from '../services/matches';
import type { MyMatchEntry } from '../../backend/src/types/match';

export const useMyMatches = () => {
  const [matches, setMatches] = useState<MyMatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyMatches();
        if (mounted) setMatches(data);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const wins = matches.filter((m) => m.team_side === 'winner').length;
  const losses = matches.filter((m) => m.team_side === 'loser').length;

  return { matches, wins, losses, loading, error };
};
