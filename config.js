require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL_SECRET;
const SUPABASE_KEY = process.env.SUPABASE_KEY_SECRET;

module.exports = {
    SUPABASE_URL,
    SUPABASE_KEY,
  };