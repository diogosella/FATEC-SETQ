import { supabase } from '../supabase.ts';
import type { MatchResult, MyMatchEntry } from '../../backend/src/types/match.ts';

export const getCurrentCycle = (): string => {
  const now = new Date();
  const dayKey = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const minutes = now.getHours() * 60 + now.getMinutes();

  const vespertinoStart = 14 * 60 + 30;
  const vespertinoEnd = 15 * 60 + 40;
  const noturnoStart = 20 * 60 + 30;
  const noturnoEnd = 21 * 60 + 30;

  if (minutes >= vespertinoStart && minutes < vespertinoEnd) {
    return `${dayKey}_vespertino`;
  }
  if (minutes >= noturnoStart && minutes <= noturnoEnd) {
    return `${dayKey}_noturno`;
  }
  if (minutes < vespertinoStart || (minutes >= vespertinoEnd && minutes < noturnoStart)) {
    return `${dayKey}_vespertino`;
  }
  return `${dayKey}_noturno`;
};

const fetchTeamPlayerIds = async (teamId: number): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_team')
    .select('user_id')
    .eq('team_id', teamId);

  if (error) throw error;
  return (data ?? []).map((row: { user_id: string }) => row.user_id);
};

export const registerMatchResult = async (
  winnerTeamId: number,
  loserTeamId: number,
  winnerTeamName: string,
  loserTeamName: string
): Promise<MatchResult> => {
  const cycleId = getCurrentCycle();

  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .insert([
      {
        winner_team_name: winnerTeamName,
        loser_team_name: loserTeamName,
        winner_team_id: winnerTeamId,
        loser_team_id: loserTeamId,
        cycle_id: cycleId,
      },
    ])
    .select()
    .single();

  if (matchErr) throw matchErr;

  const [winnerIds, loserIds] = await Promise.all([
    fetchTeamPlayerIds(winnerTeamId),
    fetchTeamPlayerIds(loserTeamId),
  ]);

  const rows = [
    ...winnerIds.map((uid) => ({
      match_id: match.id,
      user_auth_id: uid,
      team_side: 'winner' as const,
    })),
    ...loserIds.map((uid) => ({
      match_id: match.id,
      user_auth_id: uid,
      team_side: 'loser' as const,
    })),
  ];

  if (rows.length > 0) {
    const { error: playersErr } = await supabase.from('match_players').insert(rows);
    if (playersErr) throw playersErr;
  }

  return match as MatchResult;
};

export const getRecentResults = async (limit = 10): Promise<MatchResult[]> => {
  const cycleId = getCurrentCycle();

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as MatchResult[];
};

export const getMyMatches = async (): Promise<MyMatchEntry[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('match_players')
    .select(
      `team_side, matches (
        id,
        winner_team_name,
        loser_team_name,
        cycle_id,
        created_at
      )`
    )
    .eq('user_auth_id', user.id)
    .order('created_at', { foreignTable: 'matches', ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as MyMatchEntry[];
};
