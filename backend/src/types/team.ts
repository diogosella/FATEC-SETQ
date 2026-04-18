export interface Team {
  id: number;
  team_name: string;
  is_full: boolean;
  created_at: string;
}

export interface UserTeam {
  user_id: string;
  team_id: number;
}

export interface TeamMember {
  user_id: string;
  users: {
    id: number;
    name: string;
  }[];
}

export interface TeamWithMembers extends Team {
  user_team: {
    user_id: string;
    users: {
      id: number;
      name: string;
    };
  }[];
}

export interface FullTeam {
  id: number;
  team_id: number;
  team_name: string;
  filled_at: string;
}