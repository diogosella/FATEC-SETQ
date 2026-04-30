import { supabase } from '../supabase.ts';
import type { Team, TeamMember, TeamWithMembers } from '../../backend/src/types/team.ts';

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

export const registerFullTeam = async (team_id: number, team_name: string): Promise<void> => {
  const { error } = await supabase
    .from('fullteams')
    .insert([{ team_id, team_name }]);

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
  const { data, error } = await supabase
    .from('fullteams')
    .select('*')
    .order('filled_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
};