export interface MatchResult {
  id: number;
  winner_team_name: string;
  loser_team_name: string;
  winner_team_id: number | null;
  loser_team_id: number | null;
  cycle_id: string;
  created_at: string;
}

export interface MatchPlayer {
  id: number;
  match_id: number;
  user_auth_id: string;
  team_side: 'winner' | 'loser';
  created_at: string;
}

export interface MyMatchEntry {
  team_side: 'winner' | 'loser';
  matches: MatchResult;
}
