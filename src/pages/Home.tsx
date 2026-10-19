
import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import type { Match } from "../types/match";

function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Match[]>("/api/home/live")
      .then(setMatches)
      .catch(() => setError("Unable to load live matches."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Live Matches</h1>
      <p>Follow football matches happening right now.</p>

      {loading && <p>Loading live matches...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>No live matches at the moment.</p>
      )}

      <div className="matches-list">
        {matches.map((match) => (
          <article className="match-card" key={match.id}>
            <div className="match-header">
              <span>{match.league}</span>
              <span className="live-status">{match.statusLong}</span>
            </div>

            <div className="match-teams">
              <div className="team">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                />
                <span>{match.homeTeam.name}</span>
              </div>

              <strong className="match-score">
                {match.score.home ?? "-"} : {match.score.away ?? "-"}
              </strong>

              <div className="team">
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                />
                <span>{match.awayTeam.name}</span>
              </div>
            </div>

            <p className="match-venue">{match.venue}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home;
