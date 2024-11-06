const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// rota para buscar dispositivos
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

// rota para inserir novo dispositivo
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

// rota pra editar dispositivo
router.put('/device/edit/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { name, description, playlist_id, menu_id } = req.body;

  if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  if (playlist_id && menu_id){
    return res.status(400).json({ error: 'Não é possivel cadastrar uma playlist e um dispositivo, apenas um dos dois.'})
  }

  try {
      const { data, error } = await supabase
          .from('device')
          .update({ name, description, playlist_id, cardapio_id: menu_id })
          .eq('id', deviceId)
          .select();

      if (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: 'Dispositivo atualizado com sucesso!', data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


// rota para buscar a playlist associada a um dispositivo
router.get('/device/:deviceId/playlist', async (req, res) => {
  const { deviceId } = req.params;
  console.log(`Requisição recebida para dispositivo ID: ${deviceId}`);

  try {
    // Buscar o dispositivo pelo ID e pegar o playlist_id associado
    const { data: device, error: deviceError } = await supabase
      .from('device')
      .select('playlist_id')
      .eq('id', deviceId)
      .single();

    if (deviceError || !device) {
      console.log('Dispositivo não encontrado:', deviceId);
      return res.status(404).json({ error: 'Dispositivo não encontrado.' });
    }
    else if (device.playlist_id === null){
      return res.status(405).json({ error: 'O dispositivo não possui nenhuma playlist associada.'})
    }

    const playlistId = device.playlist_id;
    console.log(playlistId);

    // Agora buscar as mídias e o HTML associados à playlist
    const { data: playlistContent, error: playlistError } = await supabase
      .from('content_assignments')
      .select('media_id, html_id, duration')
      .eq('playlist_id', playlistId);

    if (playlistError) {
      console.error('Erro ao buscar conteúdo da playlist:', playlistError.message);
      return res.status(500).json({ error: playlistError.message });
    }

    // Pegar URLs das mídias e HTML
    const mediaIds = playlistContent.map(item => item.media_id).filter(id => id !== null);
    const htmlIds = playlistContent.map(item => item.html_id).filter(id => id !== null);

    console.log(mediaIds, htmlIds);

    const { data: mediaContent } = await supabase
      .from('media_content')
      .select('file_url, file_name')
      .in('id', mediaIds);

    const { data: htmlContent } = await supabase
      .from('html_content')
      .select('title, content')
      .in('id', htmlIds);

    // Retornar tudo em um formato organizado
    res.json({
      playlist: playlistId,
      media: mediaContent,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error fetching playlist content:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put
module.exports = router;
