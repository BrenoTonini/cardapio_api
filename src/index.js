const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login');
const sessionRoute = require('./routes/session');

const app = express();

const corsOptions = {
  origin: 'http://projeto-midia-indoor-navy.vercel.app'
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', loginRoute);
app.use('/api', sessionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
