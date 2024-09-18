const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const multer = require('multer');

//precisou desse multer pra guardar os arquivos em memória antes do upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);


//faz upload do arquivo no bucket
async function uploadToBucket(file) {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(`uploads/${file.originalname}`, file.buffer, {
      cacheControl: '3600',
      upsert: false,
    });

    console.log(error);
  return { data, error };
}

//salva os detalhes do arquivo na tabela
async function saveFileInfoToDatabase(file, fileExtension, filePath) {
  const { data, error } = await supabase
    .from('media_content')
    .insert([
      {
        file_name: file.originalname,
        file_extension: fileExtension,
        bucket_name: 'media',
        file_url: filePath, //path do arquivo no bucket
      },
    ]);
    console.log(error);
  return { data, error };
}

// Faz o upload de arquivos no bucket 'media'
router.post('/upload/file', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Verifica a extensão do arquivo
  const allowedExtensions = ['mp4', 'png', 'jpg'];
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: 'Invalid file type. Only MP4, PNG, and JPG are allowed.' });
  }

  try {
    //faz o upload do arquivo no bucket media/uploads
    const { data: uploadData, error: uploadError } = await uploadToBucket(file);

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    //salva os dados do arquivo na tabela public/media_content
    const { data: dbData, error: dbError } = await saveFileInfoToDatabase(
      file,
      fileExtension,
      uploadData.path
    );

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    res.status(200).json({ message: 'File uploaded and recorded successfully!', data: dbData });
  } catch (err) {
    console.error('Catch Error:', err);
    res.status(500).json({ error: err.message });
  }
});



// Rota para fazer o upload de HTML
router.post('/upload/html', async (req, res) => {
  const { htmlContent, title } = req.body;

  if (!htmlContent || !title) {
    return res.status(400).json({ error: 'HTML content and title are required' });
  }

  try {
    const { data, error } = await supabase
      .from('html_content') // Nome da tabela no Supabase
      .insert([
        { title: title, content: htmlContent } // Inserção dos dados na tabela
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