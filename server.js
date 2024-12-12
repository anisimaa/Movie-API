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

app.get('/', (req, res) => res.send("Hello World!"));

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

  app.get('/movie', async (req, res) => {
    
  });

  app.get('/movie/:id', async (req, res) => {
    
  });

  app.get('/movie/search', async (req, res) => {
    
  });
  app.post('/movie/:id/review', async (req, res) => {
    
  });

  app.post('/users/:username/favorite', async (req, res) => {
    
  });

  app.get('/users/:username/favorite', async (req, res) => {
    
  });
