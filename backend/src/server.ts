import express from 'express';
import pool from './db';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.use(express.json());

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await pool.query('INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

app.post('/users', async (req, res) => {
    const {email, password} = req.body
    try {
        const result = await pool.query('SELECT name, password FROM Users WHERE email = $1 AND password = $2', [email, password]);
        if(result.rows.length === 0 ){
             res.status(401).json({ message: 'Invaild credentials' })
             return;
        }
        
        console.log(result.rows[0]) 
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    }
}
);  



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});