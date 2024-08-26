const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login');
const sessionRoute = require('./routes/session');
const filesRoute = require('./routes/files');
const uploadRoute = require('./routes/upload');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

//resolve o erro de cors
//os requests estavam sendo bloqueados por causa de cors
const corsOptions = {
  origin: ['https://projeto-midia-indoor-navy.vercel.app', 'http://localhost:5173']
};
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
