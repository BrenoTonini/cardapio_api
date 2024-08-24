const express = require('express');
const cors = require('cors'); // Importa o CORS
const loginRoute = require('./routes/login');

const app = express();

// Configura o CORS para permitir requisições de http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api', loginRoute);

app.listen();
