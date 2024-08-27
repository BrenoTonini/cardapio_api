const express = require('express');
const cors = require('cors');  // Importa o middleware CORS
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const app = express();
const router = express.Router();
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// Configura CORS para permitir requisições da origem específica
app.use(cors({
  origin: 'https://projeto-midia-indoor-navy.vercel.app',
}));

module.exports = {
  trailingSlash: false,
  async headers() {
    return [
      {
        // matching all API routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  }
};

// Middleware para analisar JSON
app.use(express.json());

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  res.status(200).json({ data });
});

module.exports = router;
