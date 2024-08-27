require('dotenv').config();

//url e chave do supabase estão armazenadas em variável ambiente
const SUPABASE_URL = process.env.SUPABASE_URL_SECRET;
const SUPABASE_KEY = process.env.SUPABASE_KEY_SECRET;

//origem com permissão para fazer requests na api:
const URL_SITE = 'https://projeto-midia-indoor-navy.vercel.app'

module.exports = {
    SUPABASE_URL,
    SUPABASE_KEY,
  };