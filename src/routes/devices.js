const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

router.get('/devices/db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('device')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files from database:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      data
    });
  } catch (error) {
    console.error('Error fetching files from database:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload/device', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Device name and description required' });
  }

  try {
    const { data, error } = await supabase
      .from('device')
      .insert([
        { name, description }
      ])
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    console.log(data);
    res.status(200).json({ message: 'Device saved successfully!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/device/edit/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { name, description, playlist_id } = req.body;

  if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  try {
      const { data, error } = await supabase
          .from('device')
          .update({ name, description, playlist_id })
          .eq('id', deviceId);

      if (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: 'Dispositivo atualizado com sucesso!', data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.put
module.exports = router;