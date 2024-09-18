const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

/*  NÃO UTILIZAR ESSA BOMBA.

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
*/

router.get('/files/db', async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const limitNumber = parseInt(limit, 10);
        const offsetNumber = parseInt(offset, 10);

        if (isNaN(limitNumber) || isNaN(offsetNumber)) {
            return res.status(400).json({ error: 'Invalid limit or offset parameter' });
        }

        const { data, error } = await supabase
            .from('media_content')
            .select('*') // Inclui a contagem total
            .order('created_at', { ascending: false })
            .range(offsetNumber, offsetNumber + limitNumber - 1);

        if (error) {
            console.error('Error fetching files from database:', error.message);
            return res.status(500).json({ error: error.message });
        }

        res.json({
            base_url: config.SUPABASE_URL + '/storage/v1/object/public/media',
            data
        });
    } catch (error) {
        console.error('Error fetching files from database:', error.message);
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