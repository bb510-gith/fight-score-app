import sqlite3 from 'sqlite3';
import path from 'path';

// HerokuやRenderなどの環境では、ファイルシステムが一時的なものであるため、
// 永続ディスク（persistent disk）のパスを環境変数で指定できるようにする。
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'fight-score.db');

console.log(`Database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to database');
  }
});

db.serialize(() => {
  // 選手テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      jersey_number INTEGER NOT NULL,
      player_id TEXT UNIQUE
    )
  `);

  // 試合テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      tournament_name TEXT,
      opponent TEXT NOT NULL,
      is_win BOOLEAN,
      our_score INTEGER,
      opponent_score INTEGER
    )
  `);

  // スタッツテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      two_points_made INTEGER DEFAULT 0,
      two_points_missed INTEGER DEFAULT 0,
      three_points_made INTEGER DEFAULT 0,
      three_points_missed INTEGER DEFAULT 0,
      free_throws_made INTEGER DEFAULT 0,
      free_throws_missed INTEGER DEFAULT 0,
      rebounds INTEGER DEFAULT 0,
      steals INTEGER DEFAULT 0,
      blocks INTEGER DEFAULT 0,
      good_defenses INTEGER DEFAULT 0,
      fouls INTEGER DEFAULT 0,
      travelings INTEGER DEFAULT 0,
      catching_mistakes INTEGER DEFAULT 0,
      passing_mistakes INTEGER DEFAULT 0,
      double_dribbles INTEGER DEFAULT 0,
      time_mistakes INTEGER DEFAULT 0,
      jersey_number INTEGER,
      FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE,
      UNIQUE (game_id, player_id)
    )
  `);

  // Enable foreign key support
  db.run('PRAGMA foreign_keys = ON;');
});

export default db;