import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';

interface Game {
  id: number;
  date: string;
  tournament_name: string;
  opponent: string;
  is_win: boolean;
  our_score: number;
  opponent_score: number;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient('/api/games')
      .then(data => setGames(data));
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('本当にこの試合を削除しますか？')) {
      apiClient(`/api/games/${id}`, { method: 'DELETE' })
        .then(() => {
          setGames(games.filter(game => game.id !== id));
        });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>試合一覧</h2>
        <Link to="/games/new" className="btn btn-primary">試合追加</Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>日付</th>
            <th>大会名</th>
            <th>対戦相手</th>
            <th>結果</th>
            <th>スコア</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td>{new Date(game.date).toLocaleDateString()}</td>
              <td>{game.tournament_name}</td>
              <td>{game.opponent}</td>
              <td>{game.is_win ? '勝利' : '敗戦'}</td>
              <td>{game.our_score} - {game.opponent_score}</td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/games/${game.id}/stats`)}>スタッツ入力</button>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => navigate(`/games/${game.id}/tap-stats`)}>タップ入力</button>
                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/games/${game.id}/edit`)}>編集</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(game.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameList;