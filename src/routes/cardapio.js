const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

router.get('/cardapio/db', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('cardapio')
        .select('id, name, description')
        .order('created_at', { ascending: false })
  
      if (error) {
        throw error;
      }
  
      res.json({
        data
      });

    } catch (error) {
      console.error('Error fetching cardapios:', error.message);
      res.status(500).json({ error: 'Error fetching cardapios' });
    }
});

router.get('/cardapio/:idCardapio', async (req, res) => {
    const { idCardapio } = req.params;

    try {
        const { data, error } = await supabase
        .from('cardapio')
        .select('*')
        .eq('id', idCardapio)

        if (error) {
            throw error;
        }

        res.json({
            data
        });
    } catch (error) {
        console.error(`Error fetching [cardapio ID: ${idCardapio}] `, error.message);
        res.status(500).json({eror: 'Error fetching cardapio' });
    }
});

router.post('/upload/cardapio', async (req, res) =>{

    const { conteudo } = req.body;

    if (!conteudo.nome) {
        return res.status(400).json({ message: 'Nome é obrigatórios.' });
    }

    try{
        const { data, error } = await supabase
        .from('cardapio')
        .insert([
            {
                name: conteudo.nome,
                description: conteudo.description,
                content: conteudo.categorias
            }
        ]);
        
        if (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
          }
      
          res.status(200).json({ message: 'cardapio uploaded successfully!', data });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/cardapio/delete/:idCardapio', async (req, res) => {
    const { idCardapio } = req.params;

    if (isNaN(idCardapio)) {
        return res.status(400).json({ error: 'Invalid cardapio ID' });
    }
    
    try {
        const { error: deleteError } = await supabase
            .from('cardapio')
            .delete()
            .eq('id', idCardapio);

        if (deleteError) {
            console.error('error deleting cardapio', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete cardapio' });
        }

        res.status(200).json({ message: 'Cardapio deleted successfully!' });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
});

router.put('/cardapio/edit/:idCardapio', async (req, res) => {
    const { idCardapio } = req.params;
    const { nome, descricao, content } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'Nome é obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('cardapio')
            .update({
                name: nome, 
                description: descricao, 
                content: content, 
            })
            .eq('id', idCardapio);

        if (error) {
            return res.status(500).json({ message: 'Erro ao atualizar cardápio', error: error.message });
        }

        return res.status(200).json({ message: 'Cardápio atualizado com sucesso!', data });
    } catch (error) {
        console.error("Erro ao atualizar cardápio:", error);
        return res.status(500).json({ message: 'Erro ao processar a requisição', error: error.message });
    }
});


module.exports = router;