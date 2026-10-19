
export type MatchTeam = {
  id: number;
  name: string;
  logo: string;
};

export type MatchScore = {
  home: number | null;
  away: number | null;
};

export type Match = {
  id: number;
  league: string;
  leagueId: number;
  season: number;
  date: string;
  status: string;
  statusLong: string;
  venue: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
};
