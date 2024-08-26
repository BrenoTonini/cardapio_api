const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);


//implementar delete de file, texto e html
// router.delete('/files/:fileName/url', async (req, res) => {
// });