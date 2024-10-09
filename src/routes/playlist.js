const express = require('express');
const router = express.Router();
const config = require('../config');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

router.get('/playlists/db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('playlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error;
    }

    res.json({
      data
    });
  } catch (error) {
    console.error('Error fetching playlists:', error.message);
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// router.get('/playlist/:playlistId', async (req, res) => {
//   const { playlistId } = req.params;

//   try {
//     const { data, error, status } = await supabase
//       .from('playlist')
//       .select('*')
//       .eq('id', playlistId)
//       .single();

//     if (error) {
//       return res.status(status).json({ error: error.message });
//     }

//     if (data) {
//       return res.status(200).json(data);
//     } else {
//       return res.status(404).json({ error: 'Playlist não encontrada' });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

router.get('/playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;

  try {
    // Busca a playlist
    const { data: playlistData, error: playlistError, status: playlistStatus } = await supabase
      .from('playlist')
      .select('*')
      .eq('id', playlistId)
      .single();

    if (playlistError) {
      return res.status(playlistStatus).json({ error: playlistError.message });
    }

    // Busca os conteúdos associados à playlist (media_id e html_id)
    const { data: contentsData, error: contentsError, status: contentsStatus } = await supabase
      .from('content_assignments')
      .select(`
        ca_id,
        duration,
        media_id,
        html_id,
        media:media_id (id, file_name, file_extension, created_at, bucket_name, file_url),
        html:html_id (id, title, content, created_at)
      `)
      .eq('playlist_id', playlistId);

    if (contentsError) {
      return res.status(contentsStatus).json({ error: contentsError.message });
    }

    const contentsWithType = contentsData.map(content => {
      const contentType = content.media_id ? 'file' : 'html'; // Define o contentType baseado na presença de media_id ou html_id
      return {
        ...content,
        contentType,
      };
    });

    // Retorna os dados da playlist junto com os conteúdos associados
    return res.status(200).json({
      playlist: playlistData,
      contents: contentsWithType,
      base_url: config.SUPABASE_URL + '/storage/v1/object/public/media' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/upload/playlist', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Nome e descrição da playlist são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('playlist')
      .insert([{ name, description }])
      .select()

    if (error) {
      console.error('Erro ao salvar a playlist:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Playlist salva com sucesso!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/playlist/edit/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  try {
      const { data, error } = await supabase
          .from('playlist')
          .update({ name: name, description: description })
          .eq('id', playlistId);

      if (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: 'Playlist atualizada com sucesso!', data });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/playlist/add/:contentType/:contentId', async (req, res) => {
  const { contentId, contentType } = req.params;
  const { playlistId, duration } = req.body;
  
  try {
    if (!playlistId || !duration) {
      return res.status(400).json({ error: 'playlistId e duration são obrigatórios.' });
    }

    if (contentType === 'html') {
      const { data, error } = await supabase
        .from('content_assignments')
        .insert([{ playlist_id: playlistId, html_id: contentId, duration }]);

      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json({ message: 'HTML adicionado com sucesso à playlist.', data });
    } else if (contentType === 'file') {
      const { data, error } = await supabase
        .from('content_assignments')
        .insert([{ media_id: contentId, playlist_id: playlistId, duration }]);

      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json({ message: 'Arquivo adicionado com sucesso à playlist.', data });
    } else {
      return res.status(400).json({ error: 'Tipo de conteúdo inválido.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;