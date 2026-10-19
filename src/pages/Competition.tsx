
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../services/api";

type Standing = {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalDifference: number;
  points: number;
};

function Competition() {
  const { code } = useParams();

  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const competitionNames: Record<string, string> = {
    PL: "Premier League",
    PD: "La Liga",
    SA: "Serie A",
    FL1: "Ligue 1",
    BL1: "Bundesliga",
    CL: "Champions League",
  };

  const competitionName = code
    ? competitionNames[code] ?? "Competition"
    : "Competition";

  useEffect(() => {
    if (!code) {
      setError("Competition code is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    apiGet<Standing[]>(`/api/football-data/${code}/standings`)
      .then(setStandings)
      .catch(() => setError("Unable to load league standings."))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <div className="competition-page">
      <section className="competition-header">
        <div>
          <p className="page-eyebrow">COMPETITION</p>
          <h1>{competitionName}</h1>
          <p>Standings and team performance</p>
        </div>
      </section>

      <section className="standings-section">
        <h2>League Standings</h2>

        {loading && <p>Loading standings...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && standings.length === 0 && (
          <p>No standings available.</p>
        )}

        {!loading && !error && standings.length > 0 && (
          <div className="standings-table-wrapper">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Club</th>
                  <th>MP</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>

              <tbody>
                {standings.map((team) => (
                  <tr key={team.team.id}>
                    <td>{team.position}</td>
                    <td className="standings-team">
                      <div className="standings-team-info">
                        <img
                          src={team.team.crest}
                          alt=""
                          className="standings-team-crest"
                        />
                        <span>{team.team.name}</span>
                      </div>
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    <td>
                      {team.goalDifference > 0
                        ? `+${team.goalDifference}`
                        : team.goalDifference}
                    </td>
                    <td className="standings-points">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Competition;
