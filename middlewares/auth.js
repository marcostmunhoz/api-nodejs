const jwt = require('jsonwebtoken');

const config = require('../config/config')

const auth = async (req, res, next) => {
    try {
        const token = req.headers.auth;

        if (!token) return res.status(401).send({ error: 'Nenhum token fornecido.' });
        
        const data = await jwt.verify(token, config.JWT_PRIVATE_KEY);
        res.locals.userId = data.id;

        return next();
    } catch (ex) {
        return res.status(401).send({ error: 'Token inválido ou expirado.' });
    }
};

module.exports = auth;