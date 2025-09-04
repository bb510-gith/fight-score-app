import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SimpleCounter from './SimpleCounter';
import apiClient from '../api';

interface Player {
  id: number;
  name: string;
  jersey_number: number;
  player_id: string;
}

interface Stat {
  id: number;
  game_id: number;
  player_id: number;
  player_name: string;
  jersey_number: number;
  player_custom_id: string;
  two_points_made: number;
  two_points_missed: number;
  three_points_made: number;
  three_points_missed: number;
  free_throws_made: number;
  free_throws_missed: number;
  rebounds: number;
  steals: number;
  blocks: number;
  good_defenses: number;
  fouls: number;
  travelings: number;
  catching_mistakes: number;
  passing_mistakes: number;
  double_dribbles: number;
  time_mistakes: number;
}

const StatTracker: React.FC = () => {
  const { game_id } = useParams<{ game_id: string }>();
  const [gameStats, setGameStats] = useState<Stat[]>([]);

  const fetchGameData = () => {
    if (!game_id) return;
    Promise.all([
      apiClient('/api/players'),
      apiClient(`/api/stats/game/${game_id}`)
    ]).then(([players, stats]: [Player[], Stat[]]) => {
      const combinedStats = players.map(player => {
        const playerStat = stats.find(s => s.player_id === player.id);
        if (playerStat) {
          return playerStat;
        }
        return {
          id: 0,
          game_id: parseInt(game_id),
          player_id: player.id,
          player_name: player.name,
          jersey_number: player.jersey_number,
          player_custom_id: player.player_id,
          two_points_made: 0,
          two_points_missed: 0,
          three_points_made: 0,
          three_points_missed: 0,
          free_throws_made: 0,
          free_throws_missed: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          good_defenses: 0,
          fouls: 0,
          travelings: 0,
          catching_mistakes: 0,
          passing_mistakes: 0,
          double_dribbles: 0,
          time_mistakes: 0,
        };
      }).sort((a, b) => a.jersey_number - b.jersey_number);
      setGameStats(combinedStats);
    }).catch(error => console.error('Error fetching game data:', error));
  };

  useEffect(() => {
    fetchGameData();
  }, [game_id]);

  const handleStatChange = (playerId: number, fieldName: keyof Stat, value: string | number) => {
    const newGameStats = gameStats.map(stat => {
      if (stat.player_id === playerId) {
        return { ...stat, [fieldName]: typeof value === 'string' ? parseInt(value) || 0 : value };
      }
      return stat;
    });
    setGameStats(newGameStats);

    const statToUpdate = newGameStats.find(s => s.player_id === playerId);
    if (!statToUpdate) return;

    const statData = {
      game_id: parseInt(game_id || '0'),
      player_id: playerId,
      jersey_number: statToUpdate.jersey_number,
      [fieldName]: typeof value === 'string' ? parseInt(value) || 0 : value
    };

    apiClient('/api/stats', {
      method: 'POST',
      body: JSON.stringify(statData),
    }).catch(error => {
        console.error('Error updating stats, rolling back:', error);
        fetchGameData();
    });
  };

  return (
    <div>
      <h2>スタッツ入力</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>選手ID</th>
            <th>選手名</th>
            <th>2P成功</th>
            <th>2P失敗</th>
            <th>2P%</th>
            <th>3P成功</th>
            <th>3P失敗</th>
            <th>3P%</th>
            <th>FT成功</th>
            <th>FT失敗</th>
            <th>FT%</th>
            <th>ﾘﾊﾞｳﾝﾄﾞ</th>
            <th>ｽﾃｨｰﾙ</th>
            <th>ﾌﾞﾛｯｸ</th>
            <th>ﾅｲｽD</th>
            <th>ﾌｧｳﾙ</th>
            <th>ﾄﾗﾍﾞ</th>
            <th>ｷｬｯﾁﾐｽ</th>
            <th>ﾊﾟｽﾐｽ</th>
            <th>ﾀﾞﾌﾞﾄﾞﾘ</th>
            <th>時間ﾐｽ</th>
          </tr>
        </thead>
        <tbody>
          {gameStats.map((playerStat) => {
            const twoPPercentage = (playerStat.two_points_made + playerStat.two_points_missed) > 0
              ? ((playerStat.two_points_made / (playerStat.two_points_made + playerStat.two_points_missed)) * 100).toFixed(1)
              : '0.0';
            const threePPercentage = (playerStat.three_points_made + playerStat.three_points_missed) > 0
              ? ((playerStat.three_points_made / (playerStat.three_points_made + playerStat.three_points_missed)) * 100).toFixed(1)
              : '0.0';
            const ftPercentage = (playerStat.free_throws_made + playerStat.free_throws_missed) > 0
              ? ((playerStat.free_throws_made / (playerStat.free_throws_made + playerStat.free_throws_missed)) * 100).toFixed(1)
              : '0.0';

            return (
              <tr key={playerStat.player_id}>
                <td><input type="number" className="form-control form-control-sm" style={{ width: '80px' }} value={playerStat.jersey_number} onChange={(e) => handleStatChange(playerStat.player_id, 'jersey_number', e.target.value)} /></td>
                <td>{playerStat.player_custom_id}</td>
                <td>{playerStat.player_name}</td>
                <td><SimpleCounter value={playerStat.two_points_made} onChange={(newValue) => handleStatChange(playerStat.player_id, 'two_points_made', newValue)} /></td>
                <td><SimpleCounter value={playerStat.two_points_missed} onChange={(newValue) => handleStatChange(playerStat.player_id, 'two_points_missed', newValue)} /></td>
                <td>{twoPPercentage}%</td>
                <td><SimpleCounter value={playerStat.three_points_made} onChange={(newValue) => handleStatChange(playerStat.player_id, 'three_points_made', newValue)} /></td>
                <td><SimpleCounter value={playerStat.three_points_missed} onChange={(newValue) => handleStatChange(playerStat.player_id, 'three_points_missed', newValue)} /></td>
                <td>{threePPercentage}%</td>
                <td><SimpleCounter value={playerStat.free_throws_made} onChange={(newValue) => handleStatChange(playerStat.player_id, 'free_throws_made', newValue)} /></td>
                <td><SimpleCounter value={playerStat.free_throws_missed} onChange={(newValue) => handleStatChange(playerStat.player_id, 'free_throws_missed', newValue)} /></td>
                <td>{ftPercentage}%</td>
                <td><SimpleCounter value={playerStat.rebounds} onChange={(newValue) => handleStatChange(playerStat.player_id, 'rebounds', newValue)} /></td>
                <td><SimpleCounter value={playerStat.steals} onChange={(newValue) => handleStatChange(playerStat.player_id, 'steals', newValue)} /></td>
                <td><SimpleCounter value={playerStat.blocks} onChange={(newValue) => handleStatChange(playerStat.player_id, 'blocks', newValue)} /></td>
                <td><SimpleCounter value={playerStat.good_defenses} onChange={(newValue) => handleStatChange(playerStat.player_id, 'good_defenses', newValue)} /></td>
                <td><SimpleCounter value={playerStat.fouls} onChange={(newValue) => handleStatChange(playerStat.player_id, 'fouls', newValue)} /></td>
                <td><SimpleCounter value={playerStat.travelings} onChange={(newValue) => handleStatChange(playerStat.player_id, 'travelings', newValue)} /></td>
                <td><SimpleCounter value={playerStat.catching_mistakes} onChange={(newValue) => handleStatChange(playerStat.player_id, 'catching_mistakes', newValue)} /></td>
                <td><SimpleCounter value={playerStat.passing_mistakes} onChange={(newValue) => handleStatChange(playerStat.player_id, 'passing_mistakes', newValue)} /></td>
                <td><SimpleCounter value={playerStat.double_dribbles} onChange={(newValue) => handleStatChange(playerStat.player_id, 'double_dribbles', newValue)} /></td>
                <td><SimpleCounter value={playerStat.time_mistakes} onChange={(newValue) => handleStatChange(playerStat.player_id, 'time_mistakes', newValue)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StatTracker;
