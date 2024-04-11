const db = require('./database.js');
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    db.DB,
    db.USER,
    db.PASSWORD,{
        host:"127.0.0.1",
        dialect:db.dialect,
        pool:{
            max: db.pool.max,
            min: db.pool.min,
            acquire: db.pool.acquire,
            idle: db.pool.idle
        }
    }
)

sequelize.authenticate()
.then(()=>{
    console.log("Database connected successfully");
})
.catch(err =>{
    console.log("Database  connection failed!" + err);
})

const database = {}

database.Sequelize=Sequelize;
database.sequelize=sequelize;

database.users = require('../model/user.js')(sequelize,DataTypes);
database.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})
module.exports = database;