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
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
});

export {pgPool};

// defining enpoints

app.get('/', (req, res) => res.send("Hello World!"));

app.get('/genre', async (req, res) => {
    
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
