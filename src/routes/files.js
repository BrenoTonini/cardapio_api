const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

//get pra pegar os arquivos do bucket media
router.get('/files', async (req, res) => {
    try {
        const { data, error } = await supabase.storage
            .from('media')
            .list('uploads', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error('Error fetching files:', error.message);
            return res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching files:', error.message);
        res.status(500).json({ error: error.message });
    }
});

//pega a url publica do arquivo pelo nome
router.get('/files/:fileName/url', async (req, res) => {
    try {
        const { fileName } = req.params;
        const { data, error } = await supabase.storage
            .from('media')
            .getPublicUrl(`uploads/${fileName}`);

        if (error) throw error;

        res.json({ publicUrl: data.publicUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;