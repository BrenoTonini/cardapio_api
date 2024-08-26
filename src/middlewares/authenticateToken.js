const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    //ve se o usuário ta autenticado usando o token
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;
