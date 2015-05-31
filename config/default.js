module.exports = {
    server: {
        port: 8080
    },

    redis: {
        host: '127.0.0.1',
        port: 6379,
        auth: null
    },

    session: {
        secret: 'com69',
        key: 'sessionID',

        cookie: {
            max_age: 432000 //5 days
        },
        redis: {
            db: 0
        }
    }
};