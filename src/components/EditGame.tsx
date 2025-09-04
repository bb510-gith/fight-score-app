import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';

const EditGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState({
    date: '',
    tournament_name: '',
    opponent: '',
    is_win: false,
    our_score: 0,
    opponent_score: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    apiClient(`/api/games`)
      .then(games => {
        const currentGame = games.find((g: any) => g.id === parseInt(id || '0'));
        if (currentGame) {
          setGame({
            ...currentGame,
            date: new Date(currentGame.date).toISOString().split('T')[0] // Format date for input
          });
        }
      });
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setGame({ ...game, [name]: inputValue });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGame({ ...game, [name]: parseInt(value) || 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient(`/api/games/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(game),
    }).then(() => {
      navigate('/games');
    });
  };

  return (
    <div>
      <h2>試合編集</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">日付</label>
          <input type="date" className="form-control" id="date" name="date" value={game.date} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="tournament_name" className="form-label">大会名</label>
          <input type="text" className="form-control" id="tournament_name" name="tournament_name" value={game.tournament_name} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="opponent" className="form-label">対戦相手</label>
          <input type="text" className="form-control" id="opponent" name="opponent" value={game.opponent} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="our_score" className="form-label">自チームスコア</label>
          <input type="number" className="form-control" id="our_score" name="our_score" value={game.our_score} onChange={handleScoreChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="opponent_score" className="form-label">相手チームスコア</label>
          <input type="number" className="form-control" id="opponent_score" name="opponent_score" value={game.opponent_score} onChange={handleScoreChange} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="is_win" name="is_win" checked={game.is_win} onChange={handleInputChange} />
          <label className="form-check-label" htmlFor="is_win">勝利</label>
        </div>
        <button type="submit" className="btn btn-primary">更新</button>
      </form>
    </div>
  );
};

export default EditGame;