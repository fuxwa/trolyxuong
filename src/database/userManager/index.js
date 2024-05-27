const { DataTypes } = require('sequelize');
const sequelize = require('..');

const User = sequelize.define('User', {
  userId: {
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
  emailVerify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

(async () => {
  await User.sync();
})();

const userManager = {
  async addUser(discordId, email) {
    return await User.create({ discordId, email });
  },

  async removeUser(discordId) {
    const user = await User.findOne({ where: { discordId: discordId } });
    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  },

  async updateUser(userId, updatedData) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update(updatedData);
      return true;
    }
    return false;
  },

  async getAllUsers() {
    return await User.findAll();
  },

  async getUser(discordId) {
    return await User.findOne({ where: { discordId: discordId } });
  },
};

module.exports = userManager;
