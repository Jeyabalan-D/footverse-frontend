
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Competition from "./pages/Competition";
import Team from "./pages/Team";
import Player from "./pages/Player";
import Today from "./pages/Today";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Today />} />
          <Route
            path="/competitions/:code"
            element={<Competition />}
          />
          <Route path="/teams/:id" element={<Team />} />
          <Route path="/players/:id" element={<Player />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
