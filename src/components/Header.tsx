import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">FightScore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/games">試合一覧</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/players">選手一覧</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/player-stats">選手別合計</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/team-stats">チーム合計</Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={logout}>ログアウト</button>
        </div>
      </div>
    </header>
  );
};

export default Header;