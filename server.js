import express from "express"
import { Pool } from 'pg';

const app = express()

app.listen(5432, () => {
    console.log('Server running in port 5432')
})


// Database connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PostgreLocal',
  password: '',
  port: 5432, // Adjust if you're using a different port
});

pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err.stack));

// Middleware to parse JSON
app.use(express.json());

// defining enpoints

app.get('/genre', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM genre');
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving genres:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.get('/movie', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM movie');
      res.json(result.rows);
    } catch (err) {
      console.error('Error retrieving movies:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.get('/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM movie WHERE movie_id = $1', [id]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Movie not found');
      }
    } catch (err) {
      console.error('Error retrieving movie:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.get('/movie/search', async (req, res) => {
    const { query } = req.query;
    try {
      const result = await pool.query('SELECT * FROM movie WHERE movie_name ILIKE $1', [`%${query}%`]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error searching for movies:', err.stack);
      res.status(500).send('Server error');
    }
  });
  app.post('/movie/:id/review', async (req, res) => {
    const { id } = req.params;
    const { stars, review_text } = req.body;
  
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).send('Invalid star rating. Must be between 1 and 5.');
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO review (movie_id, stars, review_text, create_time) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *',
        [id, stars, review_text]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding review:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.post('/users/:username/favorite', async (req, res) => {
    const { username } = req.params;
    const { movie_id } = req.body;
  
    try {
      // Verify the user exists first
      const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const result = await pool.query(
        'INSERT INTO favorite (user_id, movie_id, create_time) VALUES ((SELECT users_id FROM users WHERE username = $1), $2, CURRENT_DATE) RETURNING *',
        [username, movie_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding to favorites:', err.stack);
      res.status(500).send('Server error');
    }
  });

  app.get('/users/:username/favorite', async (req, res) => {
    const { username } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT m.movie_id, m.movie_name, m.movie_year 
         FROM favorite f
         JOIN users u ON f.user_id = u.users_id
         JOIN movie m ON f.movie_id = m.movie_id
         WHERE u.username = $1`,
        [username]
      );
  
      if (result.rows.length > 0) {
        res.json(result.rows);
      } else {
        res.status(404).send('No favorites found for this user');
      }
    } catch (err) {
      console.error('Error retrieving favorites:', err.stack);
      res.status(500).send('Server error');
    }
  });
