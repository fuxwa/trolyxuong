require('dotenv').config()

const Sequelize = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASS, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false, 
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
  });
}

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');

    // const User = sequelize.define('User', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    //   },
    //   username: Sequelize.STRING,
    //   discriminator: Sequelize.STRING,
    // });
    // await User.sync(); 
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

module.exports = sequelize;

