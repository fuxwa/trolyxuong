 const { DataTypes } = require('sequelize');
 const sequelize = require('..');

 const Verify = sequelize.define('Verify', {
   verifyId: {
     type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
   },
   discordId: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   email: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 });
 
 (async () => {
   await Verify.sync();
 })();
 
 const verifyManager = {
   async addVerify(discordId, email, code) {
     return await Verify.create({ discordId, email, code });
   },
 
   async removeVerify(discordId, email, code) {
     const verify = await Verify.findOne({ where: { discordId: discordId, email:email, code:code } });
     if (verify) {
       await verify.destroy();
       return true;
     }
     return false;
   },
 
   async updateVerify(verifyId, updatedData) {
     const verify = await Verify.findByPk(verifyId);
     if (verify) {
       await verify.update(updatedData);
       return true;
     }
     return false;
   },
 
   async getAllVerify() {
     return await Verify.findAll();
   },
 
   async getVerify(discordId, email) {
     return await Verify.findOne({ 
      where: { discordId: discordId, email: email },
      order: [['createdAt', 'DESC']]
    });
   },
   async getVerifyByCode(discordId, code) {
    return await Verify.findOne({ 
     where: { discordId: discordId, code: code },
     order: [['createdAt', 'DESC']]
   });
  },
 };
 
 module.exports = verifyManager;
 