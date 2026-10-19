import { useEffect, useState, type CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar, { type LiveMatch } from "../components/Sidebar";
import { getAccent } from "../config/nav";

// Sample data for the design. Real live data comes later.
const SAMPLE_LIVE: LiveMatch = {
  to: "/",
  competition: "Premier League",
  minute: "67′",
  home: { short: "ARS", crest: "https://crests.football-data.org/57.png", score: 2 },
  away: { short: "CHE", crest: "https://crests.football-data.org/61.png", score: 1 },
};

function MainLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  // Close the mobile drawer whenever the page changes
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // The current page decides the glow and highlight colour
  const style = { "--team": getAccent(pathname) } as CSSProperties;

  return (
    <div className="app-layout" style={style}>
      <div
        className={`sb-backdrop${navOpen ? " show" : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      <Sidebar open={navOpen} liveMatch={SAMPLE_LIVE} liveCount={1} />

      <div className="app-column">
        <Navbar onMenuClick={() => setNavOpen(true)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;