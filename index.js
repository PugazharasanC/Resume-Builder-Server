// app.js
import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 5500;

// Middleware to handle JSON requests
app.use(json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: 'This is an API endpoint!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
