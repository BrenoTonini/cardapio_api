/*
verifica se o token fornecido é válido.
Se o token for válido, retorna as informações do usuário;
caso contrário, retorna um erro.
*/

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

router.get('/session', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  return res.status(200).json({ user });
});

module.exports = router;
