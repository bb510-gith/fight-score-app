import React, { useState, useEffect } from 'react';
import apiClient from '../api';

interface TeamTotalStat {
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

const TeamTotalStats: React.FC = () => {
  const [totalStats, setTotalStats] = useState<TeamTotalStat | null>(null);
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
    const url = `/api/stats/team/total${queryString ? `?${queryString}` : ''}`;

    apiClient(url).then(data => setTotalStats(data));
  };

  useEffect(() => {
    fetchTotalStats();
  }, [startDate, endDate]);

  const twoPPercentage = totalStats && (totalStats.total_two_points_made + totalStats.total_two_points_missed) > 0
    ? ((totalStats.total_two_points_made / (totalStats.total_two_points_made + totalStats.total_two_points_missed)) * 100).toFixed(1) + '%'
    : '0.0%';

  const threePPercentage = totalStats && (totalStats.total_three_points_made + totalStats.total_three_points_missed) > 0
    ? ((totalStats.total_three_points_made / (totalStats.total_three_points_made + totalStats.total_three_points_missed)) * 100).toFixed(1) + '%'
    : '0.0%';

  const ftPercentage = totalStats && (totalStats.total_free_throws_made + totalStats.total_free_throws_missed) > 0
    ? ((totalStats.total_free_throws_made / (totalStats.total_free_throws_made + totalStats.total_free_throws_missed)) * 100).toFixed(1) + '%'
    : '0.0%';

  return (
    <div>
      <h2>チーム合計スタッツ</h2>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">開始日</label>
        <input type="date" className="form-control" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">終了日</label>
        <input type="date" className="form-control" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      {totalStats ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>スタッツ</th>
              <th>合計</th>
              <th>成功率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2ポイント</td>
              <td>{totalStats.total_two_points_made} / {totalStats.total_two_points_made + totalStats.total_two_points_missed}</td>
              <td>{twoPPercentage}</td>
            </tr>
            <tr>
              <td>3ポイント</td>
              <td>{totalStats.total_three_points_made} / {totalStats.total_three_points_made + totalStats.total_three_points_missed}</td>
              <td>{threePPercentage}</td>
            </tr>
            <tr>
              <td>フリースロー</td>
              <td>{totalStats.total_free_throws_made} / {totalStats.total_free_throws_made + totalStats.total_free_throws_missed}</td>
              <td>{ftPercentage}</td>
            </tr>
            <tr>
              <td>リバウンド</td>
              <td>{totalStats.total_rebounds}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>スティール</td>
              <td>{totalStats.total_steals}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>ブロック</td>
              <td>{totalStats.total_blocks}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>ナイスディフェンス</td>
              <td>{totalStats.total_good_defenses}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>ファウル</td>
              <td>{totalStats.total_fouls}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>トラベリング</td>
              <td>{totalStats.total_travelings}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>キャッチミス</td>
              <td>{totalStats.total_catching_mistakes}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>パスミス</td>
              <td>{totalStats.total_passing_mistakes}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>ダブルドリブル</td>
              <td>{totalStats.total_double_dribbles}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>3秒バイオレーション</td>
              <td>{totalStats.total_time_mistakes}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>データがありません。</p>
      )}
    </div>
  );
};

export default TeamTotalStats;