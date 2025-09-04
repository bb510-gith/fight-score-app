import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();

  const navbarTogglerRef = useRef<HTMLButtonElement>(null);

  const handleNavLinkClick = () => {
    if (navbarTogglerRef.current && window.innerWidth < 992) { // 992px is Bootstrap's 'lg' breakpoint
      navbarTogglerRef.current.click(); // Simulate a click on the toggler to close the menu
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button ref={navbarTogglerRef} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" to="/">FightScore</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/games" onClick={handleNavLinkClick}>試合一覧</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/players" onClick={handleNavLinkClick}>選手一覧</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/player-stats" onClick={handleNavLinkClick}>選手別合計</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/team-stats" onClick={handleNavLinkClick}>チーム合計</Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={logout}>ログアウト</button>
        </div>
      </div>
    </header>
  );
};

export default Header;