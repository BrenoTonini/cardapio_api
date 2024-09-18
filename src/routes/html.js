const express = require('express');
const router = express.Router();
const config = require('../config');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// rota para buscar os conteúdos html
router.get('/html/db', async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;

  try {
    const { data, error } = await supabase
      .from('html_content')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      data
    });
  } catch (error) {
    console.error('Error fetching HTML contents:', error.message);
    res.status(500).json({ error: 'Error fetching HTML contents' });
  }
});

module.exports = router;
