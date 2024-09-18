const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);


//rota pra deletar arquivo pelo id
router.delete('/files/delete/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        // pega o nome do bucket e o caminho do arquivo a partir da tabela
        const { data: fileData, error: fetchError } = await supabase
            .from('media_content')
            .select('file_url, bucket_name')
            .eq('id', fileId)
            .single();

        if (fetchError || !fileData) {
            return res.status(404).json({ message: 'Arquivo não encontrado', error: fetchError });
        }

        const { file_url, bucket_name } = fileData;

        // deleta o arquivo do bucket
        const { error: storageError } = await supabase
            .storage
            .from(bucket_name)
            .remove([file_url]);

        if (storageError) {
            console.error('Erro ao deletar o arquivo do bucket:', storageError);
            return res.status(400).json({ message: 'Erro ao deletar o arquivo do bucket', error: storageError });
        }

        // deleta o arquivo da tabela
        const { error: deleteError } = await supabase
            .from('media_content')
            .delete()
            .eq('id', fileId);

        if (deleteError) {
            return res.status(400).json({ message: 'Erro ao deletar o arquivo da tabela', error: deleteError });
        }

        return res.status(200).json({ message: 'Arquivo deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar arquivo:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
  
// rota pra deletar conteudo html
router.delete('/html/delete/:contentId', async (req, res) => {
    const { contentId } = req.params;
  
    try {
      const { error: deleteError } = await supabase
        .from('html_content')
        .delete()
        .eq('id', contentId);
  
      if (deleteError) {
        console.error('Error deleting content:', deleteError.message);
        return res.status(500).json({ error: 'Failed to delete content' });
      }
  
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      console.error('Unexpected error:', error.message);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });
  

  module.exports = router;