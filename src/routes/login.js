const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  res.status(200).json({ message: 'Login successful' });
});

module.exports = router;