import express from "express"
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const app = express()
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})

const pgPool = new pg.Pool({
  host: process.env.DB_HOST,         
  port: process.env.DB_PORT,        
  database: process.env.DB_DATABASE, 
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD,
});

export {pgPool};

// defining endpoints
app.get('/', (req, res) => res.send("Hello World!")); //for testing

// search for genres
app.get('/genre', async (req, res) => {
  try {
    // Query the database for all genres
    const result = await pgPool.query('SELECT * FROM genre'); 

    // Send the result back as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
  });

  //add new movie genre
  app.post('/genre', async (req, res) => {
    const { genre_name } = req.body;
    try {
      const result = await pgPool.query(
        'INSERT INTO genre (genre_name, create_time) VALUES ($1, CURRENT_DATE) RETURNING *',
        [genre_name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding genre:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  // deleting movie by id
  app.delete('/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pgPool.query(
        'DELETE FROM movie WHERE movie_id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send('Movie not found');
      }
      res.status(204).send('Movie deleted');
    } catch (error) {
      console.error('Error deleting movie:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  // search for movies
  app.get('/movie', async (req, res) => {
    try {
      const result = await pgPool.query('SELECT * FROM movie');
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching movies:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  // add new movie
  app.post('/movie', async (req, res) => {
    const { movie_name, movie_year, movie_genre } = req.body;
    try {
      const result = await pgPool.query(
        'INSERT INTO movie (movie_name, movie_year, movie_genre, create_time) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *',
        [movie_name, movie_year, movie_genre]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding movie:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });
  
// search for movie by id
  app.get('/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pgPool.query('SELECT * FROM movie WHERE movie_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Movie not found');
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching movie by ID:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  //adding review for a movie
  app.post('/movie/:id/review', async (req, res) => {
    const { id } = req.params;
    const { username, stars, review_text } = req.body;
    try {
      
      const result = await pgPool.query(
        'INSERT INTO review (stars, review_text, create_time) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
        [stars, review_text]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding review:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  //search for movies
  app.get('/movie/search', async (req, res) => {
    const { title, genre, year } = req.query;
    try {
      let query = 'SELECT * FROM movie WHERE 1=1';
      let params = [];
  
      if (title) {
        query += ' AND movie_name ILIKE $1';
        params.push(`%${title}%`);
      }
      if (genre) {
        query += ' AND movie_genre = $2';
        params.push(genre);
      }
      if (year) {
        query += ' AND movie_year = $3';
        params.push(year);
      }
  
      const result = await pgPool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error searching movies:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  //user registeration
  app.post('/users', async (req, res) => {
    const { name, username, password, year_of_birth } = req.body;
    try {
      const result = await pgPool.query(
        'INSERT INTO users (name, username, password, year_of_birth, create_time) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
        [name, username, password, year_of_birth]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });
  
  //adding movie to user
  app.post('/users/:username/favorite', async (req, res) => {
    const { username } = req.params;
    const { movie_id } = req.body;
    try {
      const userResult = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      const result = await pgPool.query(
        'INSERT INTO favorite (user_id, movie_id, create_time) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
        [userResult.rows[0].users_id, movie_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding favorite movie:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });
  
// add favorite movie for user
  app.post('/users/:username/favorite', async (req, res) => {
    const { username } = req.params;
    const { movie_id } = req.body;
    try {
      const userResult = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const movieResult = await pgPool.query('SELECT * FROM movie WHERE movie_id = $1', [movie_id]);
      if (movieResult.rows.length === 0) {
        return res.status(404).send('Movie not found');
      }
  
      const result = await pgPool.query(
        'INSERT INTO favorite (movie_id) VALUES ($1) RETURNING *',
        [movie_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding favorite movie:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });

  // getting favorite movies for user by search
  app.get('/users/:username/favorite', async (req, res) => {
    const { username } = req.params;
    try {
      const userResult = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const result = await pgPool.query(
        'SELECT m.* FROM movie m JOIN favorite f ON m.movie_id = f.movie_id JOIN users u ON f.username = u.username WHERE u.username = $1',
        [username]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching favorite movies:', error.message);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });