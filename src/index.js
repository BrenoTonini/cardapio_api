const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY } = require('./config');

const app = express();
app.use(express.json());

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post('/login', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
