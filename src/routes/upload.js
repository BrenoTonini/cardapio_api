const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const multer = require('multer');

//precisou desse multer pra guardar os arquivos em memória antes do upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

//faz o upload de arquivos no bucket media
router.post('/upload/file', upload.single('file'), async (req, res) => {
    const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`uploads/${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'File uploaded successfully!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//faz o upload de html
router.post('/upload/html', async (req, res) => {
  return;
});

module.exports = router;