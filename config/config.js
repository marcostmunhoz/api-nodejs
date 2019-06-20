const env = process.env.NODE_ENV || 'dev';
const config = () => {
    switch (env) {
        case 'dev': return {
            MONGODB_USERNAME: process.env.MONGODB_USERNAME,
            MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
            MONGODB_HOST: process.env.MONGODB_HOST,
            get MONGODB_CONNECTION_STRING() {
                return `mongodb+srv://${this.MONGODB_USERNAME}:${this.MONGODB_PASSWORD}@${this.MONGODB_HOST}`;
            },
            JWT_PRIVATE_KEY: '123456789',
            MONGOOSE_SETTINGS: {
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 500,
                poolSize: 5,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        };
    }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}.`);
console.log(config());

module.exports = config();