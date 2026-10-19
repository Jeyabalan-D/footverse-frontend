import type { IconName } from "../components/Icon";

export interface NavItem {
  label: string;
  to: string;
  accent: string;
  icon?: IconName;
  end?: boolean;
  subtitle?: string;
  logo?: string;
  short?: string;
}

export interface TeamData {
  id: number;
  label: string;
  short: string;
  accent: string;
  crest: string;
  standing: string;
  form: Array<"W" | "D" | "L">;
}

export const DEFAULT_ACCENT = "#ef0107";
const crest = (id: number) => `https://crests.football-data.org/${id}.png`;

export const homeItems: NavItem[] = [
  { label: "Live Matches", to: "/", icon: "radio", accent: DEFAULT_ACCENT, end: true },
  { label: "Today’s Matches", to: "/today", icon: "cal", accent: DEFAULT_ACCENT },
  // { label: "Upcoming", to: "/upcoming", icon: "clock", accent: DEFAULT_ACCENT },
];

export const competitions: NavItem[] = [
  { label: "Premier League", to: "/competitions/PL", short: "PL", subtitle: "England", accent: "#8b3dff", logo: "https://crests.football-data.org/PL.png" },
  { label: "La Liga", to: "/competitions/PD", short: "LL", subtitle: "Spain", accent: "#ff4b44", logo: "https://crests.football-data.org/PD.png" },
  { label: "Champions League", to: "/competitions/CL", short: "UCL", subtitle: "Europe", accent: "#2f6bff", logo: "https://crests.football-data.org/CL.png" },
];

export const playerItems: NavItem[] = [
  { label: "Player Profile", to: "/players/99813", icon: "id", subtitle: "Stats, form and career", accent: "#ff9f1c" },
];

// Sample data for the design. Replace standing and form with real data later.
export const allTeams: TeamData[] = [
  { id: 57, label: "Arsenal", short: "ARS", accent: "#ef0107", crest: crest(57), standing: "2nd in Premier League", form: ["W", "W", "D", "W", "L"] },
  { id: 61, label: "Chelsea", short: "CHE", accent: "#1c63d5", crest: crest(61), standing: "5th in Premier League", form: ["L", "W", "W", "D", "W"] },
  { id: 64, label: "Liverpool", short: "LIV", accent: "#c8102e", crest: crest(64), standing: "1st in Premier League", form: ["W", "W", "W", "D", "W"] },
  { id: 65, label: "Man City", short: "MCI", accent: "#6cabdd", crest: crest(65), standing: "3rd in Premier League", form: ["D", "W", "L", "W", "W"] },
  { id: 66, label: "Man United", short: "MUN", accent: "#da291c", crest: crest(66), standing: "8th in Premier League", form: ["L", "D", "W", "L", "W"] },
  { id: 73, label: "Tottenham", short: "TOT", accent: "#3b5bdb", crest: crest(73), standing: "6th in Premier League", form: ["W", "L", "D", "W", "W"] },
  { id: 86, label: "Real Madrid", short: "RMA", accent: "#c9a227", crest: crest(86), standing: "1st in La Liga", form: ["W", "W", "W", "W", "D"] },
  { id: 81, label: "Barcelona", short: "BAR", accent: "#a50044", crest: crest(81), standing: "2nd in La Liga", form: ["W", "D", "W", "W", "L"] },
  { id: 78, label: "Atlético", short: "ATM", accent: "#cb3524", crest: crest(78), standing: "4th in La Liga", form: ["D", "W", "L", "W", "D"] },
];

export const defaultFollowedIds = [57, 86, 65];

export function teamNavItems(id: number): NavItem[] {
  const accent = allTeams.find((t) => t.id === id)?.accent ?? DEFAULT_ACCENT;
  return [
    { label: "Overview", to: `/teams/${id}`, icon: "grid", accent, end: true },
    { label: "Fixtures", to: `/teams/${id}/fixtures`, icon: "cal", accent },
    { label: "Results", to: `/teams/${id}/results`, icon: "hist", accent },
    { label: "Squad", to: `/teams/${id}/squad`, icon: "users", accent },
    { label: "Statistics", to: `/teams/${id}/statistics`, icon: "chart", accent },
  ];
}

const staticItems: NavItem[] = [...homeItems, ...competitions, ...playerItems];

/** Glow colour for the current page. */
export function getAccent(pathname: string): string {
  const team = pathname.match(/^\/teams\/(\d+)/);
  if (team) return allTeams.find((t) => t.id === Number(team[1]))?.accent ?? DEFAULT_ACCENT;

  let best: NavItem | undefined;
  for (const item of staticItems) {
    const hit = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
    if (hit && (!best || item.to.length > best.to.length)) best = item;
  }
  return best?.accent ?? DEFAULT_ACCENT;
}