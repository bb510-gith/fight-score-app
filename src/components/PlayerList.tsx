import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

interface Player {
  id: number;
  name: string;
  jersey_number: number;
  player_id: string;
}

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', jersey_number: '', player_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    apiClient('/api/players').then(data => setPlayers(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient('/api/players', {
      method: 'POST',
      body: JSON.stringify({
        ...newPlayer,
        jersey_number: parseInt(newPlayer.jersey_number)
      }),
    })
    .then(data => {
      setPlayers([...players, { ...newPlayer, id: data.id, jersey_number: parseInt(newPlayer.jersey_number) }]);
      setNewPlayer({ name: '', jersey_number: '', player_id: '' }); // Reset form
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('本当にこの選手を削除しますか？関連するスタッツも全て削除されます。')) {
      apiClient(`/api/players/${id}`, { method: 'DELETE' })
        .then(() => {
          setPlayers(players.filter(player => player.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>選手一覧</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">選手追加</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <input type="text" name="name" className="form-control" placeholder="名前" value={newPlayer.name} onChange={handleInputChange} required />
            </div>
            <div className="col-md-3">
              <input type="number" name="jersey_number" className="form-control" placeholder="背番号" value={newPlayer.jersey_number} onChange={handleInputChange} required />
            </div>
            <div className="col-md-3">
              <input type="text" name="player_id" className="form-control" placeholder="選手ID" value={newPlayer.player_id} onChange={handleInputChange} />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">追加</button>
            </div>
          </form>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>背番号</th>
            <th>選手ID</th>
            <th>名前</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.jersey_number}</td>
              <td>{player.player_id}</td>
              <td>{player.name}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/players/${player.id}/edit`)}>編集</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(player.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerList;