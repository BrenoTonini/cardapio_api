const config = require('../config');

const allowCors = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', config.URL_SITE)
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    next();
}

module.exports = allowCors;