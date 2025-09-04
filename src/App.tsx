import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PlayerList from './components/PlayerList';
import GameList from './components/GameList';
import AddGame from './components/AddGame';
import StatTracker from './components/StatTracker';
import EditPlayer from './components/EditPlayer';
import EditGame from './components/EditGame';
import TapStatCounter from './components/TapStatCounter';
import PlayerTotalStats from './components/PlayerTotalStats';
import TeamTotalStats from './components/TeamTotalStats';
import Login from './components/Login';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedApp />
      ) : (
        <UnauthenticatedApp />
      )}
    </Router>
  );
};

const AuthenticatedApp: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/games" />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/games/new" element={<AddGame />} />
          <Route path="/games/:id/edit" element={<EditGame />} />
          <Route path="/games/:game_id/stats" element={<StatTracker />} />
          <Route path="/games/:game_id/tap-stats" element={<TapStatCounter />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/players/:id/edit" element={<EditPlayer />} />
          <Route path="/player-stats" element={<PlayerTotalStats />} />
          <Route path="/team-stats" element={<TeamTotalStats />} />
          {/* If logged in, trying to access /login redirects to home */}
          <Route path="/login" element={<Navigate to="/" />} />
          {/* Catch-all route to redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

const UnauthenticatedApp: React.FC = () => {
  return (
    <main className="container mt-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* If not logged in, any other path redirects to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </main>
  );
};

export default App;
