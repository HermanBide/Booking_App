const express = require('express')
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require( 'mongoose');
const User = require('./models/user.js');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connection to mongodb was successful')
})
.catch(e => {
  console.error('Error could not Connect to mongodb', e.message)
})


const PORT = process.env.PORT || 4000
const app = express()
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'https://localhost:3000'
}));
app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.send("Hello there!");
  });

  app.get('/test', (req, res) => {
    res.json('test ok')
  })

  app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    res.json({ name, email, password })
  })

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
});