import React, { useState, useEffect } from 'react';
import apiClient from '../api';

interface PlayerTotalStat {
  id: number;
  name: string;
  jersey_number: number;
  player_custom_id: string;
  total_two_points_made: number;
  total_two_points_missed: number;
  total_three_points_made: number;
  total_three_points_missed: number;
  total_free_throws_made: number;
  total_free_throws_missed: number;
  total_rebounds: number;
  total_steals: number;
  total_blocks: number;
  total_good_defenses: number;
  total_fouls: number;
  total_travelings: number;
  total_catching_mistakes: number;
  total_passing_mistakes: number;
  total_double_dribbles: number;
  total_time_mistakes: number;
}

const PlayerTotalStats: React.FC = () => {
  const [totalStats, setTotalStats] = useState<PlayerTotalStat[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTotalStats = () => {
    const params = new URLSearchParams();
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }
    
    const queryString = params.toString();
    const url = `/api/players/stats/total${queryString ? `?${queryString}` : ''}`;

    apiClient(url).then(data => setTotalStats(data));
  };

  useEffect(() => {
    fetchTotalStats();
  }, [startDate, endDate]);

  return (
    <div>
      <h2>選手別合計スタッツ</h2>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">開始日</label>
        <input type="date" className="form-control" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">終了日</label>
        <input type="date" className="form-control" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>選手ID</th>
            <th>名前</th>
            <th>2P IN</th>
            <th>2P OUT</th>
            <th>2P%</th>
            <th>3P IN</th>
            <th>3P OUT</th>
            <th>3P%</th>
            <th>FT IN</th>
            <th>FT OUT</th>
            <th>FT%</th>
            <th>リバウンド</th>
            <th>スティール</th>
            <th>ブロック</th>
            <th>ナイD</th>
            <th>ファウル</th>
            <th>トラベリング</th>
            <th>キャッチミス</th>
            <th>パスミス</th>
            <th>ダブルドリブル</th>
            <th>3秒ミス</th>
          </tr>
        </thead>
        <tbody>
          {totalStats.map(stat => (
            <tr key={stat.id}>
              <td>{stat.jersey_number}</td>
              <td>{stat.player_custom_id}</td>
              <td>{stat.name}</td>
              <td>{stat.total_two_points_made}</td>
              <td>{stat.total_two_points_missed}</td>
              <td>
                {
                  (stat.total_two_points_made + stat.total_two_points_missed) > 0
                    ? ((stat.total_two_points_made / (stat.total_two_points_made + stat.total_two_points_missed)) * 100).toFixed(1) + '%'
                    : '0.0%'
                }
              </td>
              <td>{stat.total_three_points_made}</td>
              <td>{stat.total_three_points_missed}</td>
              <td>
                {
                  (stat.total_three_points_made + stat.total_three_points_missed) > 0
                    ? ((stat.total_three_points_made / (stat.total_three_points_made + stat.total_three_points_missed)) * 100).toFixed(1) + '%'
                    : '0.0%'
                }
              </td>
              <td>{stat.total_free_throws_made}</td>
              <td>{stat.total_free_throws_missed}</td>
              <td>
                {
                  (stat.total_free_throws_made + stat.total_free_throws_missed) > 0
                    ? ((stat.total_free_throws_made / (stat.total_free_throws_made + stat.total_free_throws_missed)) * 100).toFixed(1) + '%'
                    : '0.0%'
                }
              </td>
              <td>{stat.total_rebounds}</td>
              <td>{stat.total_steals}</td>
              <td>{stat.total_blocks}</td>
              <td>{stat.total_good_defenses}</td>
              <td>{stat.total_fouls}</td>
              <td>{stat.total_travelings}</td>
              <td>{stat.total_catching_mistakes}</td>
              <td>{stat.total_passing_mistakes}</td>
              <td>{stat.total_double_dribbles}</td>
              <td>{stat.total_time_mistakes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTotalStats;