const express = require('express');
const loginRoute = require('./routes/login');
const sessionRoute = require('./routes/session');
const filesRoute = require('./routes/files');
const uploadRoute = require('./routes/upload');
const authenticateToken = require('./middlewares/authenticateToken');
const cors = require('cors');

const app = express();


const corsOptions = {
  origin: 'https://projeto-midia-indoor-navy.vercel.app',
}

app.use(cors(corsOptions));

app.use(express.json());

//rotas que não precisam do auth token
app.use('/api', loginRoute);
app.use('/api', sessionRoute);

//rotas que precisam do auth token
app.use(authenticateToken);
app.use('/api', filesRoute);
app.use('/api', uploadRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
