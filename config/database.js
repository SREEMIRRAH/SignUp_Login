module.exports={
    HOST:'127.0.0.1',
    USER:'root',
    PASSWORD:'Sree@2002',
    DB:'signup_login',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};