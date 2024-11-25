import express from "express"

const app = express()

app.listen(3001, () => {
    console.log('Server running in port 3001')
})

// defining enpoints

app.get('/genre', (req, res) => {
    res.send('This is genre page') //test text
})

app.get('/movie', (req, res) => {
    // Return all movies
})

app.get('/movie/:id', (req, res) => {
    // Return a single movie by ID
})

app.get('/movie/search', (req, res) => {
    // Search movies by a query
})

app.post('/movie/:id/review', (req, res) => {
    // Add a review to a movie
})

app.post('/users/:username/favorite', (req, res) => {
    // Add a movie to a user's favorites
})

app.get('/users/:username/favorite', (req, res) => {
    // Get all favorites for a user
})
