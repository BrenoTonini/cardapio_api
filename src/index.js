const express = require('express');
const http = require('http');
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
const setupSocketIO = require('./routes/socket');
const setupSupabaseMonitor = require('./routes/supabaseMonitor');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();
const server = http.createServer(app);
const io = setupSocketIO(server);

app.use(cors());
app.use(express.json());

setupSupabaseMonitor(io);

//olá mundo na url base
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//rotas que não precisam do auth token
app.use('/api', loginRoute);
app.use('/api', sessionRoute);

//rotas que precisam do auth token
app.use('/api', authenticateToken);
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