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
    const { deviceName, deviceDescription } = req.body;
  
    if (!deviceName || !deviceDescription) {
      return res.status(400).json({ error: 'Device name and description required' });
    }
  
    try {
      const { data, error } = await supabase
      .from('device')
      .insert([
        { name: deviceName, description: deviceDescription }
      ]);
      
      if (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
      }
  
      res.status(200).json({ message: 'Device saved successfully!', data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;