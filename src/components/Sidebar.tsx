import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import {
  allTeams,
  competitions,
  defaultFollowedIds,
  homeItems,
  playerItems,
  teamNavItems,
  type NavItem,
  type TeamData,
} from "../config/nav";

export interface LiveMatch {
  to: string;
  competition: string;
  minute: string;
  home: { short: string; crest?: string; score: number };
  away: { short: string; crest?: string; score: number };
}

interface SidebarProps {
  open: boolean;
  liveMatch?: LiveMatch | null;
  liveCount?: number;
}

const MAX_TEAMS = 6;

const linkClass = ({ isActive }: { isActive: boolean }) => `sb-item${isActive ? " active" : ""}`;

function Crest({ src, label, color, className = "" }: { src?: string; label: string; color?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={`sb-crest ${className}`} style={color ? { background: color } : undefined}>
        {label}
      </span>
    );
  }
  return (
    <span className={`sb-crest has-img ${className}`}>
      <img src={src} alt="" onError={() => setFailed(true)} />
    </span>
  );
}

function ModuleHeader({ icon, title, count, live }: { icon: IconName; title: string; count?: string; live?: boolean }) {
  return (
    <header className="sb-mh">
      <span className="sb-mi"><Icon name={icon} /></span>
      <h2>{title}</h2>
      {count && (
        <span className="sb-cnt">
          {live && <i className="sb-pulse" />}
          {count}
        </span>
      )}
    </header>
  );
}

function IconItem({ item, badge }: { item: NavItem; badge?: number }) {
  return (
    <NavLink to={item.to} end={item.end} className={linkClass}>
      <span className="sb-tile">{item.icon && <Icon name={item.icon} />}</span>
      <span className="sb-lbl">
        {item.subtitle ? <><b>{item.label}</b><small>{item.subtitle}</small></> : item.label}
      </span>
      {badge ? <span className="sb-badge">{badge}</span> : null}
      {item.subtitle && <Icon name="chev" className="sb-i sb-go" />}
    </NavLink>
  );
}

function Sidebar({ open, liveMatch, liveCount = 0 }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [teamOpen, setTeamOpen] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [followedIds, setFollowedIds] = useState<number[]>(defaultFollowedIds);
  const [selectedId, setSelectedId] = useState<number>(defaultFollowedIds[0]);

  // Opening /teams/:id switches the sidebar to that team
  const routeId = pathname.match(/^\/teams\/(\d+)/)?.[1];
  useEffect(() => {
    if (routeId && followedIds.includes(Number(routeId))) setSelectedId(Number(routeId));
  }, [routeId, followedIds]);

  const followed = followedIds
    .map((id) => allTeams.find((t) => t.id === id))
    .filter((t): t is TeamData => Boolean(t));
  const selected = followed.find((t) => t.id === selectedId) ?? followed[0];
  const subItems = useMemo(() => teamNavItems(selected.id), [selected.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allTeams.filter((t) => t.label.toLowerCase().includes(q) || t.short.toLowerCase().includes(q)) : allTeams;
  }, [query]);

  const atLimit = followedIds.length >= MAX_TEAMS;

  const pickTeam = (id: number) => {
    setSelectedId(id);
    navigate(`/teams/${id}`);
  };

  // Follow or unfollow. The last team can't be removed.
  const toggleTeam = (id: number) =>
    setFollowedIds((cur) => {
      if (cur.includes(id)) return cur.length > 1 ? cur.filter((x) => x !== id) : cur;
      return cur.length < MAX_TEAMS ? [...cur, id] : cur;
    });

  return (
    <aside className={`sidebar${collapsed ? " mini" : ""}${open ? " open" : ""}`}>
      <div className="sb-top">
        <span className="sb-logo" aria-hidden="true" />
        <b>Footverse</b>
        <button
          type="button"
          className="sb-ghost sb-collapse"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name="panel" />
        </button>
      </div>

      <label className="sb-search">
        <Icon name="search" />
        <input type="search" placeholder="Search" aria-label="Search" />
      </label>

      <nav aria-label="Main">
        <section className="sb-mod">
          <ModuleHeader icon="home" title="Home" count={liveCount ? `${liveCount} live` : undefined} live />
          <IconItem item={homeItems[0]} badge={liveCount} />
          {liveMatch && (
            <NavLink to={liveMatch.to} className="sb-live">
              <span className="sb-meta">
                <i className="sb-pulse" />
                {liveMatch.competition}
                <span className="sb-min">{liveMatch.minute}</span>
              </span>
              <span className="sb-score">
                <span className="sb-n">
                  <Crest src={liveMatch.home.crest} label={liveMatch.home.short} className="sm" />
                  {liveMatch.home.score}
                </span>
                <span className="sb-n">
                  {liveMatch.away.score}
                  <Crest src={liveMatch.away.crest} label={liveMatch.away.short} className="sm" color="#475569" />
                </span>
              </span>
            </NavLink>
          )}
          {homeItems.slice(1).map((item) => <IconItem key={item.to} item={item} />)}
        </section>

        <section className="sb-mod">
          <ModuleHeader icon="trophy" title="Competitions" count={String(competitions.length)} />
          {competitions.map((c) => (
            <NavLink key={c.to} to={c.to} className={linkClass}>
              <Crest src={c.logo} label={c.short ?? ""} color={c.accent} className="sq" />
              <span className="sb-lbl"><b>{c.label}</b><small>{c.subtitle}</small></span>
              <Icon name="chev" className="sb-i sb-go" />
            </NavLink>
          ))}
        </section>

        <section className="sb-mod" style={{ "--tc": selected.accent } as CSSProperties}>
          <ModuleHeader icon="shield" title="Teams" count={`${followed.length}/${MAX_TEAMS}`} />

          <div className="sb-strip">
            {followed.map((t) => (
              <button
                key={t.id}
                type="button"
                className="sb-chip"
                style={{ "--tc": t.accent } as CSSProperties}
                aria-pressed={t.id === selected.id}
                aria-label={t.label}
                title={t.label}
                onClick={() => pickTeam(t.id)}
              >
                <Crest src={t.crest} label={t.short} color={t.accent} />
              </button>
            ))}
            <button
              type="button"
              className="sb-add"
              aria-expanded={pickerOpen}
              aria-label={pickerOpen ? "Close team list" : "Add a team"}
              onClick={() => setPickerOpen((o) => !o)}
            >
              <Icon name={pickerOpen ? "check" : "plus"} />
            </button>
          </div>

          {pickerOpen && (
            <div className="sb-picker">
              <label className="sb-search sb-psearch">
                <Icon name="search" />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search teams"
                  aria-label="Search teams"
                />
              </label>
              {filtered.length === 0 && <p className="sb-note">No teams match.</p>}
              {atLimit && <p className="sb-note">You can follow up to {MAX_TEAMS} teams. Remove one to add another.</p>}
              <ul className="sb-plist">
                {filtered.map((t) => {
                  const isFollowed = followedIds.includes(t.id);
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        className="sb-prow"
                        aria-pressed={isFollowed}
                        disabled={!isFollowed && atLimit}
                        onClick={() => toggleTeam(t.id)}
                      >
                        <Crest src={t.crest} label={t.short} color={t.accent} className="sm" />
                        <span>{t.label}</span>
                        <Icon name={isFollowed ? "check" : "plus"} className="sb-i sb-pk" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="sb-team"
            aria-expanded={teamOpen}
            aria-controls="sb-team-sub"
            onClick={() => setTeamOpen((o) => !o)}
          >
            <span className="sb-wm" aria-hidden="true">{selected.short}</span>
            <Crest src={selected.crest} label={selected.short} color={selected.accent} className="big" />
            <span className="sb-who">
              {selected.label}
              <small>{selected.standing}</small>
            </span>
            <Icon name="chev" className="sb-i sb-chev" />
            <span className="sb-form" aria-label="Last five results">
              {selected.form.map((r, i) => (
                <span key={i} className={`sb-f ${r.toLowerCase()}`}>{r}</span>
              ))}
            </span>
          </button>
          <div className="sb-sub" id="sb-team-sub">
            <div>
              {subItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  <span className="sb-tile">{item.icon && <Icon name={item.icon} />}</span>
                  <span className="sb-lbl">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        <section className="sb-mod">
          <ModuleHeader icon="user" title="Players" />
          {playerItems.map((item) => <IconItem key={item.to} item={item} />)}
        </section>
      </nav>
    </aside>
  );
}

export default Sidebar;