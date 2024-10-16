const express = require('express');
const cors = require('cors');
const config = require('./config');
const loginRoute = require('./routes/login');
const sessionRoute = require('./routes/session');
const filesRoute = require('./routes/files');
const htmlRoute = require('./routes/html');
const devicesRoute = require('./routes/devices');
const playlistsRoute = require('./routes/playlist');
const uploadRoute = require('./routes/upload');
const deleteRoute = require('./routes/delete');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

app.use(cors({
  origin: [
    'https://playlist-player.vercel.app',
    'https://projeto-midia-indoor-navy.vercel.app'
  ]
}));

app.use(express.json());

// Rotas que não precisam do auth token
app.use('/api', loginRoute);
app.use('/api', sessionRoute);

// Rotas que precisam do auth token
app.use(authenticateToken);
app.use('/api', filesRoute);
app.use('/api', htmlRoute);
app.use('/api', devicesRoute);
app.use('/api', playlistsRoute);
app.use('/api', uploadRoute);
app.use('/api', deleteRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
