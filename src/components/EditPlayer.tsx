import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';

const EditPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState({ name: '', jersey_number: '', player_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    apiClient('/api/players')
      .then(players => {
        const currentPlayer = players.find((p: any) => p.id === parseInt(id || '0'));
        if (currentPlayer) {
          setPlayer(currentPlayer);
        }
      });
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayer({ ...player, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient(`/api/players/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        ...player,
        jersey_number: parseInt(player.jersey_number)
      }),
    }).then(() => {
      navigate('/players');
    });
  };

  return (
    <div>
      <h2>選手編集</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">名前</label>
          <input type="text" className="form-control" id="name" name="name" value={player.name} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="jersey_number" className="form-label">背番号</label>
          <input type="number" className="form-control" id="jersey_number" name="jersey_number" value={player.jersey_number} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="player_id" className="form-label">選手ID</label>
          <input type="text" className="form-control" id="player_id" name="player_id" value={player.player_id} onChange={handleInputChange} />
        </div>
        <button type="submit" className="btn btn-primary">更新</button>
      </form>
    </div>
  );
};

export default EditPlayer;