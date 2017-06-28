module.exports = {
    port: 3000,
    session: {                      // express-session的信息
        secret: 'refactorblog',
        key: 'refactorblog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/refactorblog'
}