const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

//autentica usuário e retorna o access_token para acessar os outros endpoints
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("não autorizado");
    return res.status(401).json({ message: error.message });
  }

  if (data && data.session) {
    return res.status(200).json({ data }); // Retorna o token
  } else {
    return res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
});
module.exports = router;