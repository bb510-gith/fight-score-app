"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
// Middleware for token authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401); // if there isn't any token
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403); // if token is no longer valid
        req.user = user;
        next(); // proceed to the next middleware
    });
};
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Login API (public)
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.SECRET_PASSWORD) {
        const accessToken = jsonwebtoken_1.default.sign({ loggedIn: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ accessToken: accessToken });
    }
    else {
        res.status(401).send('Password incorrect');
    }
});
// --- Protected APIs ---
// 選手API
app.get('/api/players', authenticateToken, (req, res) => {
    database_1.default.all('SELECT * FROM players', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
app.post('/api/players', authenticateToken, (req, res) => {
    const { name, jersey_number, player_id } = req.body;
    if (!jersey_number) {
        res.status(400).json({ error: 'Jersey number is required' });
        return;
    }
    database_1.default.run('INSERT INTO players (name, jersey_number, player_id) VALUES (?, ?, ?)', [name, jersey_number, player_id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});
app.put('/api/players/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, jersey_number, player_id } = req.body;
    if (!jersey_number) {
        res.status(400).json({ error: 'Jersey number is required' });
        return;
    }
    database_1.default.run('UPDATE players SET name = ?, jersey_number = ?, player_id = ? WHERE id = ?', [name, jersey_number, player_id, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Player updated successfully' });
    });
});
app.delete('/api/players/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    database_1.default.run('DELETE FROM players WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Player deleted successfully' });
    });
});
// 試合API
app.get('/api/games', authenticateToken, (req, res) => {
    database_1.default.all('SELECT * FROM games', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
app.post('/api/games', authenticateToken, (req, res) => {
    const { date, tournament_name, opponent, is_win, our_score, opponent_score } = req.body;
    if (!date || !opponent) {
        res.status(400).json({ error: 'Date and opponent are required' });
        return;
    }
    database_1.default.run('INSERT INTO games (date, tournament_name, opponent, is_win, our_score, opponent_score) VALUES (?, ?, ?, ?, ?, ?)', [date, tournament_name, opponent, is_win, our_score, opponent_score], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});
app.put('/api/games/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { date, tournament_name, opponent, is_win, our_score, opponent_score } = req.body;
    if (!date || !opponent) {
        res.status(400).json({ error: 'Date and opponent are required' });
        return;
    }
    database_1.default.run('UPDATE games SET date = ?, tournament_name = ?, opponent = ?, is_win = ?, our_score = ?, opponent_score = ? WHERE id = ?', [date, tournament_name, opponent, is_win, our_score, opponent_score, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Game updated successfully' });
    });
});
app.delete('/api/games/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    database_1.default.run('DELETE FROM games WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Game deleted successfully' });
    });
});
// スタッツAPI
app.get('/api/stats/game/:game_id', authenticateToken, (req, res) => {
    const { game_id } = req.params;
    database_1.default.all(`SELECT s.*, p.name as player_name, s.jersey_number, p.player_id as player_custom_id
     FROM stats s
     JOIN players p ON s.player_id = p.id
     WHERE s.game_id = ?`, [game_id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
app.post('/api/stats', authenticateToken, (req, res) => {
    const { game_id, player_id, jersey_number, ...otherStats } = req.body;
    if (!game_id || !player_id || jersey_number === undefined) {
        res.status(400).json({ error: 'Game ID, Player ID, and Jersey Number are required' });
        return;
    }
    const statColumns = Object.keys(otherStats);
    const statValues = Object.values(otherStats);
    const insertColumns = ['game_id', 'player_id', 'jersey_number', ...statColumns];
    const insertPlaceholders = insertColumns.map(() => '?').join(', ');
    const insertValues = [game_id, player_id, jersey_number, ...statValues];
    const updateSetClause = statColumns.map(col => `${col} = excluded.${col}`).join(', ');
    const sql = `
    INSERT INTO stats (${insertColumns.join(', ')})
    VALUES (${insertPlaceholders})
    ON CONFLICT(game_id, player_id) DO UPDATE SET
    ${updateSetClause}
  `;
    database_1.default.run(sql, insertValues, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Stats updated successfully' });
    });
});
app.get('/api/players/stats/total', authenticateToken, (req, res) => {
    const { start_date, end_date } = req.query;
    let query = `
    SELECT
        p.id,
        p.name,
        p.jersey_number,
        p.player_id AS player_custom_id,
        SUM(s.two_points_made) AS total_two_points_made,
        SUM(s.two_points_missed) AS total_two_points_missed,
        SUM(s.three_points_made) AS total_three_points_made,
        SUM(s.three_points_missed) AS total_three_points_missed,
        SUM(s.free_throws_made) AS total_free_throws_made,
        SUM(s.free_throws_missed) AS total_free_throws_missed,
        SUM(s.rebounds) AS total_rebounds,
        SUM(s.steals) AS total_steals,
        SUM(s.blocks) AS total_blocks,
        SUM(s.good_defenses) AS total_good_defenses,
        SUM(s.fouls) AS total_fouls,
        SUM(s.travelings) AS total_travelings,
        SUM(s.catching_mistakes) AS total_catching_mistakes,
        SUM(s.passing_mistakes) AS total_passing_mistakes,
        SUM(s.double_dribbles) AS total_double_dribbles,
        SUM(s.time_mistakes) AS total_time_mistakes
    FROM
        stats s
    JOIN
        players p ON s.player_id = p.id
    JOIN
        games g ON s.game_id = g.id
  `;
    const params = [];
    if (start_date && end_date) {
        query += ` WHERE g.date BETWEEN ? AND ?`;
        params.push(start_date, end_date);
    }
    else if (start_date) {
        query += ` WHERE g.date >= ?`;
        params.push(start_date);
    }
    else if (end_date) {
        query += ` WHERE g.date <= ?`;
        params.push(end_date);
    }
    query += `
    GROUP BY
        p.id, p.name, p.jersey_number, p.player_id
    ORDER BY
        p.jersey_number;
  `;
    database_1.default.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
app.get('/api/stats/team/total', authenticateToken, (req, res) => {
    const { start_date, end_date } = req.query;
    let query = `
    SELECT
        SUM(s.two_points_made) AS total_two_points_made,
        SUM(s.two_points_missed) AS total_two_points_missed,
        SUM(s.three_points_made) AS total_three_points_made,
        SUM(s.three_points_missed) AS total_three_points_missed,
        SUM(s.free_throws_made) AS total_free_throws_made,
        SUM(s.free_throws_missed) AS total_free_throws_missed,
        SUM(s.rebounds) AS total_rebounds,
        SUM(s.steals) AS total_steals,
        SUM(s.blocks) AS total_blocks,
        SUM(s.good_defenses) AS total_good_defenses,
        SUM(s.fouls) AS total_fouls,
        SUM(s.travelings) AS total_travelings,
        SUM(s.catching_mistakes) AS total_catching_mistakes,
        SUM(s.passing_mistakes) AS total_passing_mistakes,
        SUM(s.double_dribbles) AS total_double_dribbles,
        SUM(s.time_mistakes) AS total_time_mistakes
    FROM
        stats s
  `;
    const params = [];
    if (start_date || end_date) {
        query += `JOIN games g ON s.game_id = g.id WHERE `;
        if (start_date && end_date) {
            query += `g.date BETWEEN ? AND ?`;
            params.push(start_date, end_date);
        }
        else if (start_date) {
            query += `g.date >= ?`;
            params.push(start_date);
        }
        else if (end_date) {
            query += `g.date <= ?`;
            params.push(end_date);
        }
    }
    database_1.default.get(query, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map