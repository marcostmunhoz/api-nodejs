const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user');
const config = require('../config/config');

const router = express.Router();

const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.JWT_PRIVATE_KEY, { expiresIn: '7d' });
};

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({});

        return res.send(users);
    } catch (ex) {
        return res.status(500).send({ error: `Erro na consulta: ${ex.message}.` });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.send(400).send({ error: 'Usuário e senha são requeridos para a criação.' });
        if (await Users.findOne({ email })) res.status(400).send({ error: `Usuário já registrado para o email '${email}'.` });

        const user = await Users.create({ email, password });
        user.password = undefined;

        return res.status(201).send({
            message: 'Usuário criado com sucesso',
            data: user,
            token: createUserToken(user.id)
        });
    } catch (ex) {
        return res.status(500).send({ error: `Erro na criação do usuário: ${ex.message}.` });
    }
});

router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id,
            { email, password } = req.body;

        if (!email && !password) return res.status(400).send({ error: 'Usuário ou senha são requeridos para a edição.' });
        
        let user = await Users.findOne({ _id: id });

        if (!user) return res.status(400).send({ error: `Usuário não localizado para o id ${id}` });

        if (email) {
            if (await Users.findOne({ email, _id: { $not: { $eq: id } } })) return res.status(400).send({ error: `Usuário já registrado para o email ${email}.` });
            user.email = email;
        }
        if (password) user.password = password;

        await user.save();
        user.password = undefined;
        
        return res.send({
            message: 'Usuário editado com sucesso.',
            data: user
        });
    } catch (ex) {
        return res.status(500).send({ error: `Erro na edição do usuário: ${ex.message}.` });
    }
});

router.post('/auth', async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) return res.status(400).send({ error: 'Usuário e senha são requeridos para a autenticação.' });

        let user = await Users.findOne({ email }).select('+password');

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                user.password = undefined;

                return res.send({
                    message: 'Usuário autenticado com sucesso.',
                    data: user,
                    token: createUserToken(user.id)
                });
            }
        }

        return res.status(401).send({ error: 'Usuário e/ou senha inválidos.' });
    } catch (ex) {
        return res.status(500).send({ error: `Erro na autenticação do usuário: ${ex.message}.` });
    }
});

module.exports = router;