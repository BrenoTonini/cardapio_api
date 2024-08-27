const express = require('express');
const cors = require('cors');  // Importa o middleware CORS
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const app = express();
const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// Middleware para adicionar cabeçalhos CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Se a requisição for um "preflight" (opções), responde diretamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Middleware para analisar JSON
app.use(express.json());

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  res.status(200).json({ data });
});

module.exports = router;
