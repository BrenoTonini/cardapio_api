const express = require('express');
const loginRoute = require('./routes/login');

const app = express();
app.use(express.json());

app.use('/api', loginRoute);

app.listen(); 