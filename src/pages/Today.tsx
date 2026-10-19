import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../services/api";
import type { Match } from "../types/match";

type MatchState = "live" | "done" | "upcoming" | "off";
type Filter = "all" | "live" | "upcoming" | "done";

const LIVE_WORDS = ["first half", "second half", "halftime", "half time", "extra time", "break time", "penalty", "in progress"];
const OFF_WORDS = ["postponed", "cancelled", "canceled", "suspended", "abandoned", "walkover", "awarded"];

function getState(match: Match): MatchState {
  const s = match.statusLong.toLowerCase();
  if (OFF_WORDS.some((w) => s.includes(w))) return "off";
  if (s.includes("finished") || s.includes("full time") || s.startsWith("after")) return "done";
  if (LIVE_WORDS.some((w) => s.includes(w))) return "live";
  return "upcoming";
}

/* Kickoff time in the user's own timezone.
   NOTE: this assumes your Match type has an ISO date string called `date`.
   If the field has a different name, change it here. */
function getKickoff(match: Match): string | null {
  const raw = (match as { date?: string }).date;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MatchRow({ match }: { match: Match }) {
  const state = getState(match);
  const kickoff = getKickoff(match);
  const { home, away } = match.score;
  const hasScore = home !== null && home !== undefined && away !== null && away !== undefined;

  const homeWon = state === "done" && hasScore && home! > away!;
  const awayWon = state === "done" && hasScore && away! > home!;

  return (
    <article className={`fx-row${state === "live" ? " is-live" : ""}`}>
      <div className={`fx-side home${awayWon ? " dim" : ""}`}>
        <img className="fx-crest" src={match.homeTeam.logo} alt="" />
        <span className="fx-name">{match.homeTeam.name}</span>
      </div>

      <div className="fx-mid">
        {state === "upcoming" || state === "off" ? (
          <strong className="fx-big">{state === "off" ? "–" : kickoff ?? "vs"}</strong>
        ) : (
          <strong className="fx-big">
            {home ?? 0}
            <em>:</em>
            {away ?? 0}
          </strong>
        )}

        {state === "live" ? (
          <span className="fx-pill live">
            <span className="fx-dot" />
            {match.statusLong}
          </span>
        ) : (
          <span className={`fx-pill${state === "done" ? " done" : ""}`}>{match.statusLong}</span>
        )}
      </div>

      <div className={`fx-side away${homeWon ? " dim" : ""}`}>
        <img className="fx-crest" src={match.awayTeam.logo} alt="" />
        <span className="fx-name">{match.awayTeam.name}</span>
      </div>

      {match.venue && (
        <p className="fx-venue">
          <PinIcon />
          {match.venue}
        </p>
      )}
    </article>
  );
}

function Today() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");

    apiGet<Match[]>(`/api/home/fixtures?date=${today}`)
      .then(setMatches)
      .catch(() => setError("Unable to load today's fixtures."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c = { all: matches.length, live: 0, upcoming: 0, done: 0 };
    matches.forEach((m) => {
      const s = getState(m);
      if (s === "live") c.live++;
      else if (s === "upcoming") c.upcoming++;
      else if (s === "done") c.done++;
    });
    return c;
  }, [matches]);

  /* Filter, then group by league (leagues with a live match come first). */
  const groups = useMemo(() => {
    const visible = matches.filter((m) => filter === "all" || getState(m) === filter);
    const map = new Map<string, Match[]>();
    visible.forEach((m) => map.set(m.league, [...(map.get(m.league) ?? []), m]));

    return [...map.entries()].sort(([, a], [, b]) => {
      const al = a.some((m) => getState(m) === "live") ? 0 : 1;
      const bl = b.some((m) => getState(m) === "live") ? 0 : 1;
      return al - bl;
    });
  }, [matches, filter]);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "live", label: "Live" },
    { key: "upcoming", label: "Upcoming" },
    { key: "done", label: "Finished" },
  ];

  return (
    <div className="fx-page">
      <header className="fx-head">
        <h1>Today's Matches</h1>
        <p>All football fixtures scheduled for today.</p>
      </header>

      {!loading && !error && matches.length > 0 && (
        <div className="fx-filters" role="group" aria-label="Filter matches">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`fx-chip${filter === c.key ? " active" : ""}`}
              aria-pressed={filter === c.key}
              onClick={() => setFilter(c.key)}
            >
              {c.key === "live" && <span className="fx-dot" />}
              {c.label}
              <small>{counts[c.key]}</small>
            </button>
          ))}
        </div>
      )}

      {loading && <div className="fx-state">Loading today's matches...</div>}
      {error && <div className="fx-state error">{error}</div>}
      {!loading && !error && matches.length === 0 && (
        <div className="fx-state">No matches found for today.</div>
      )}
      {!loading && !error && matches.length > 0 && groups.length === 0 && (
        <div className="fx-state">No matches in this filter.</div>
      )}

      {groups.map(([league, list]) => (
        <section className="fx-group" key={league}>
          <div className="fx-group-head">
            <span className="fx-group-icon">
              <TrophyIcon />
            </span>
            <h2>{league}</h2>
            <span className="fx-count">
              {list.length} {list.length === 1 ? "match" : "matches"}
            </span>
          </div>

          <div className="fx-rows">
            {list.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Today;