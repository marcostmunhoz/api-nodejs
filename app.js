const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const routes = {
        index: require('./routes/index'),
        users: require('./routes/users')
    },
    config = require('./config/config');

mongoose.connect(config.MONGODB_CONNECTION_STRING, config.MONGOOSE_SETTINGS);
mongoose.connection.on('disconnected', () => {
    console.log('Conexão perdida.');
});
mongoose.connection.on('connected', () => {
    console.log('Conexão realizada com sucesso.');
});
mongoose.connection.on('error', (err) => {
    console.log(`Ocorreu um erro durante a conexão. Mensagem de erro: ${err}`)
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes.index);
app.use('/users', routes.users);

app.listen(3000);

module.exports = app;