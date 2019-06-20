const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
    console.log(res.locals.userId);

    return res.send({
        message: 'GET /: OK'
    });
});

router.post('/', (req, res) => {
    return res.send({
        message: 'POST /: OK'
    });
});

module.exports = router;