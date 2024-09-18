const express = require('express');
const cors = require('cors');
const config = require('./config');
const loginRoute = require('./routes/login');
const sessionRoute = require('./routes/session');
const filesRoute = require('./routes/files');
const htmlRoute = require('./routes/html');
const uploadRoute = require('./routes/upload');
const deleteRoute = require('./routes/delete');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

// app.use(cors({
//   origin: config.URL_SITE
// }));

app.use(cors());

app.use(express.json());

//rotas que não precisam do auth token
app.use('/api', loginRoute);
app.use('/api', sessionRoute);

//rotas que precisam do auth token
app.use(authenticateToken);
app.use('/api', filesRoute);
app.use('/api', htmlRoute);
app.use('/api', uploadRoute);
app.use('/api', deleteRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
