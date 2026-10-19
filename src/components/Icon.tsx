import type { ReactNode } from "react";

export type IconName =
  | "home" | "radio" | "cal" | "clock" | "grid" | "hist" | "users"
  | "chart" | "id" | "chev" | "panel" | "menu" | "search" | "trophy"
  | "shield" | "user" | "plus" | "check";

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  clock: <><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5M16 2v4M8 2v4M3 10h5" /><circle cx="17.5" cy="17.5" r="4.5" /><path d="M17.5 15.5v2l1 1" /></>,
  grid: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  hist: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l4 2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
  id: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="12" cy="11" r="3" /><path d="M7 19c.8-2 2.5-3 5-3s4.2 1 5 3" /></>,
  chev: <path d="m6 9 6 6 6-6" />,
  panel: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 3v18" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.2 1.2C7.9 18.7 7 20.2 7 22M14 14.7V17c0 .6.5 1 1.2 1.2.9.5 1.8 2 1.8 3.8M18 2H6v7a6 6 0 0 0 12 0z" />,
  shield: <path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.5 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12 5 5 9-10" />,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = "sb-i" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}