import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const TapStatCounter: React.FC = () => {
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

  const handleTap = (playerId: number, statName: keyof Stat) => {
    const currentStat = gameStats.find(s => s.player_id === playerId);
    if (!currentStat) return;

    const newValue = (currentStat[statName] as number) + 1;

    const newGameStats = gameStats.map(stat => {
      if (stat.player_id === playerId) {
        return { ...stat, [statName]: newValue };
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
      [statName]: newValue
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
      <h2>タップでスタッツカウント</h2>
      {gameStats.map(playerStat => (
        <div key={playerStat.player_id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{playerStat.jersey_number} - {playerStat.player_name}</h5>
            <div className="d-flex justify-content-between flex-wrap">
              <div className="d-flex flex-column me-3">
                <div className="d-flex flex-row flex-wrap">
                  <button className="btn btn-primary m-1" onClick={() => handleTap(playerStat.player_id, 'two_points_made')}>2P IN ({playerStat.two_points_made})</button>
                  <button className="btn btn-secondary m-1" onClick={() => handleTap(playerStat.player_id, 'two_points_missed')}>2P OUT ({playerStat.two_points_missed})</button>
                </div>
                <div className="d-flex flex-row flex-wrap">
                  <button className="btn btn-primary m-1" onClick={() => handleTap(playerStat.player_id, 'three_points_made')}>3P IN ({playerStat.three_points_made})</button>
                  <button className="btn btn-secondary m-1" onClick={() => handleTap(playerStat.player_id, 'three_points_missed')}>3P OUT ({playerStat.three_points_missed})</button>
                </div>
                <div className="d-flex flex-row flex-wrap">
                  <button className="btn btn-primary m-1" onClick={() => handleTap(playerStat.player_id, 'free_throws_made')}>FT IN ({playerStat.free_throws_made})</button>
                  <button className="btn btn-secondary m-1" onClick={() => handleTap(playerStat.player_id, 'free_throws_missed')}>FT OUT ({playerStat.free_throws_missed})</button>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex flex-wrap">
                  <button className="btn btn-info m-1" onClick={() => handleTap(playerStat.player_id, 'rebounds')}>リバウンド ({playerStat.rebounds})</button>
                  <button className="btn btn-info m-1" onClick={() => handleTap(playerStat.player_id, 'steals')}>スティール ({playerStat.steals})</button>
                  <button className="btn btn-info m-1" onClick={() => handleTap(playerStat.player_id, 'blocks')}>ブロック ({playerStat.blocks})</button>
                  <button className="btn btn-info m-1" onClick={() => handleTap(playerStat.player_id, 'good_defenses')}>ナイD ({playerStat.good_defenses})</button>
                </div>
                <div className="d-flex flex-wrap mt-2">
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'fouls')}>ファウル ({playerStat.fouls})</button>
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'travelings')}>トラベリング ({playerStat.travelings})</button>
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'catching_mistakes')}>キャッチミス ({playerStat.catching_mistakes})</button>
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'passing_mistakes')}>パスミス ({playerStat.passing_mistakes})</button>
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'double_dribbles')}>ダブルドリブル ({playerStat.double_dribbles})</button>
                  <button className="btn btn-warning m-1" onClick={() => handleTap(playerStat.player_id, 'time_mistakes')}>3秒ミス ({playerStat.time_mistakes})</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TapStatCounter;
