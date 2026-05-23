import { supabase } from '../supabase.ts';
import type { Team, TeamMember, TeamWithMembers, CyclePeriod } from '../../backend/src/types/team.ts';

export const getTeams = async (): Promise<TeamWithMembers[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      user_team (
        user_id,
        users (
          id,
          name
        )
      )
    `);

  if (error) throw error;
  return data ?? [];
};

export const createTeam = async (team_name: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: existingMembership } = await supabase
        .from('user_team')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingMembership) throw new Error('Você já está em um time');

    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{ team_name, is_full: false }])
        .select()
        .single();

    if (teamError) throw teamError;

    const { error: memberError } = await supabase
        .from('user_team')
        .insert([{ user_id: user.id, team_id: team.id }]);

    if (memberError) throw memberError;
};

export const updateTeam = async (id: number, updates: Partial<Team>): Promise<Team> => {
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTeam = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const joinTeam = async (team_id: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: existing } = await supabase
    .from('user_team')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) throw new Error('Você já está em um time');

  const { error } = await supabase
    .from('user_team')
    .insert([{
      user_id: user.id,
      team_id: team_id
    }]);

  if (error) throw error;
};

export const getUserTeam = async (): Promise<number | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_team')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return null;
  return data?.team_id ?? null;
};

export const getTeamMembers = async (team_id: number): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('user_team')
    .select(`
      user_id,
      users (id, name)
    `)
    .eq('team_id', team_id);

  if (error) throw error;
  return (data as TeamMember[]) ?? [];
};

export const leaveTeam = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: membership } = await supabase
    .from('user_team')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) return;

  const { error } = await supabase
    .from('user_team')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;

  const { count } = await supabase
    .from('user_team')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', membership.team_id);

  if (count === 0) {
    await deleteTeam(membership.team_id);
  } else if (count !== null && count < 6) {
    const { error: updateError } = await supabase
      .from('teams')
      .update({ is_full: false })
      .eq('id', membership.team_id);

    if (updateError) throw updateError;

    await supabase
      .from('fullteams')
      .delete()
      .eq('team_id', membership.team_id);
  }
}

export const getUserCurrentTeam = async (): Promise<TeamWithMembers | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_team')
    .select(`
      team_id,
      teams (
        *,
        user_team (
          user_id,
          users (id, name)
        )
      )
    `)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data || !data.teams) return null;

  return (Array.isArray(data.teams) ? data.teams[0] : data.teams) as unknown as TeamWithMembers;
};

const pad = (n: number) => n.toString().padStart(2, '0');
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const periodForNow = (now: Date): CyclePeriod => {
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes < 18 * 60 ? 'vespertino' : 'noturno';
};

export const getCurrentCycleInfo = (): { period: CyclePeriod; date: string } => {
  const now = new Date();
  return { period: periodForNow(now), date: dateKey(now) };
};

const nextBusinessDateKey = (from: Date): string => {
  const next = new Date(from);
  next.setDate(next.getDate() + 1);
  const dow = next.getDay();
  if (dow === 6) next.setDate(next.getDate() + 2);
  if (dow === 0) next.setDate(next.getDate() + 1);
  return dateKey(next);
};

export const registerFullTeam = async (team_id: number, team_name: string): Promise<void> => {
  const { period, date } = getCurrentCycleInfo();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('fullteams')
    .insert([{
      team_id,
      team_name,
      filled_at: now,
      original_filled_at: now,
      cycle_period: period,
      cycle_date: date,
      transferred: false,
    }]);

  if (error) throw error;
};

export const markTeamAsFull = async (team_id: number): Promise<void> => {
  const { error } = await supabase
    .from('teams')
    .update({ is_full: true })
    .eq('id', team_id);

  if (error) throw error;
};

export const getFullTeams = async () => {
  const { period, date } = getCurrentCycleInfo();
  const { data, error } = await supabase
    .from('fullteams')
    .select('*')
    .eq('cycle_period', period)
    .lte('cycle_date', date)
    .order('transferred', { ascending: false })
    .order('original_filled_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export const declareWinner = async (
  winnerTeamId: number,
  loserTeamId: number
): Promise<void> => {
  if (winnerTeamId === loserTeamId) {
    throw new Error('Vencedor e perdedor não podem ser o mesmo time');
  }

  const { error } = await supabase
    .from('fullteams')
    .update({ filled_at: new Date().toISOString() })
    .eq('team_id', loserTeamId);

  if (error) throw error;
};

const CLEANUP_STORAGE_KEY = 'setq_last_cleanup_cycle';

const getCycleToClean = (): { id: string; period: CyclePeriod; date: string } | null => {
  const now = new Date();
  const day = dateKey(now);
  const minutes = now.getHours() * 60 + now.getMinutes();

  const vespertinoEnd = 15 * 60 + 40;
  const noturnoStart = 20 * 60 + 30;
  const noturnoEnd = 21 * 60 + 30;

  if (minutes >= vespertinoEnd && minutes < noturnoStart) {
    return { id: `${day}_vespertino`, period: 'vespertino', date: day };
  }
  if (minutes >= noturnoEnd) {
    return { id: `${day}_noturno`, period: 'noturno', date: day };
  }
  return null;
};

const closeOldCycle = async (period: CyclePeriod, date: string): Promise<void> => {
  const { data: ciclo, error: ciclErr } = await supabase
    .from('fullteams')
    .select('team_id')
    .eq('cycle_period', period)
    .eq('cycle_date', date);
  if (ciclErr) throw ciclErr;

  const teamIdsDoCiclo: number[] = (ciclo ?? []).map((r: { team_id: number }) => r.team_id);
  if (teamIdsDoCiclo.length === 0) return;

  const cycleIdMatches = `${date}_${period}`;
  const { data: matches, error: matchesErr } = await supabase
    .from('matches')
    .select('winner_team_id, loser_team_id')
    .eq('cycle_id', cycleIdMatches);
  if (matchesErr) throw matchesErr;

  const teamsQueJogaram = new Set<number>();
  (matches ?? []).forEach((m: { winner_team_id: number | null; loser_team_id: number | null }) => {
    if (m.winner_team_id != null) teamsQueJogaram.add(m.winner_team_id);
    if (m.loser_team_id != null) teamsQueJogaram.add(m.loser_team_id);
  });

  const sobreviventes = teamIdsDoCiclo.filter((id) => !teamsQueJogaram.has(id));
  const aDeletar = teamIdsDoCiclo.filter((id) => teamsQueJogaram.has(id));

  if (sobreviventes.length > 0) {
    const nextDate = nextBusinessDateKey(new Date(date + 'T12:00:00'));
    const { error: updErr } = await supabase
      .from('fullteams')
      .update({ cycle_date: nextDate, transferred: true })
      .in('team_id', sobreviventes);
    if (updErr) throw updErr;
  }

  if (aDeletar.length > 0) {
    const { error: utErr } = await supabase.from('user_team').delete().in('team_id', aDeletar);
    if (utErr) throw utErr;
    const { error: ftErr } = await supabase.from('fullteams').delete().in('team_id', aDeletar);
    if (ftErr) throw ftErr;
    const { error: tErr } = await supabase.from('teams').delete().in('id', aDeletar);
    if (tErr) throw tErr;
  }

  const { data: surviving } = await supabase.from('fullteams').select('team_id');
  const survivingSet = new Set<number>((surviving ?? []).map((r: { team_id: number }) => r.team_id));
  const { data: allTeams } = await supabase.from('teams').select('id');
  const incompletos: number[] = (allTeams ?? [])
    .map((r: { id: number }) => r.id)
    .filter((id: number) => !survivingSet.has(id));

  if (incompletos.length > 0) {
    await supabase.from('user_team').delete().in('team_id', incompletos);
    await supabase.from('teams').delete().in('id', incompletos);
  }
};

export const transferUnplayedTeamsIfCycleEnded = async (): Promise<boolean> => {
  const cycle = getCycleToClean();
  if (!cycle) return false;

  const lastCleaned =
    typeof window !== 'undefined' ? window.localStorage.getItem(CLEANUP_STORAGE_KEY) : null;
  if (lastCleaned === cycle.id) return false;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CLEANUP_STORAGE_KEY, cycle.id);
  }

  try {
    await closeOldCycle(cycle.period, cycle.date);
    return true;
  } catch (err) {
    if (typeof window !== 'undefined') {
      if (lastCleaned !== null) {
        window.localStorage.setItem(CLEANUP_STORAGE_KEY, lastCleaned);
      } else {
        window.localStorage.removeItem(CLEANUP_STORAGE_KEY);
      }
    }
    throw err;
  }
};
