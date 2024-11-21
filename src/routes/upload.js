const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const multer = require('multer');

//precisou desse multer pra guardar os arquivos em memória antes do upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

router.post('/upload/file', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const allowedExtensions = ['mp4', 'png', 'jpg'];
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: 'Invalid file type. Only MP4, PNG, and JPG are allowed.' });
  }

  try {
    // Upload do arquivo ao bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(`uploads/${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Salvar informações do arquivo no banco de dados
    const { data: dbData, error: dbError } = await supabase
      .from('media_content')
      .insert([
        {
          file_name: file.originalname,
          file_extension: fileExtension,
          bucket_name: 'media',
          file_url: uploadData.path,
        },
      ])
      .select(); 

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    res.status(200).json({ message: 'File uploaded and recorded successfully!', data: dbData });
  } catch (err) {
    console.error('Catch Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload/html', async (req, res) => {
  const { htmlContent, title } = req.body;

  if (!htmlContent || !title) {
    return res.status(400).json({ error: 'HTML content and title are required' });
  }

  try {
    const { data, error } = await supabase
      .from('html_content')
      .insert([
        { title: title, content: htmlContent }
      ]);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'HTML content saved successfully!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;