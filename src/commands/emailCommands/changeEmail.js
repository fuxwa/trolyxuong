const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const userManager = require('../../database/userManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('change-email')
    .setDescription('Thay đổi email của người dùng được tag')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Chọn người dùng để thay đổi email')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Nhập email mới')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const newEmail = interaction.options.getString('email');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return interaction.reply({ content: 'Email không hợp lệ!', ephemeral: true });
    }

    try {
      const userData = await userManager.getUser(user.id);
      if(userData) {
        if(!userData.dataValues.emailVerify) {
           return await interaction.reply({ content: 'Không tìm thấy email người dùng!', ephemeral: true });
        }
        userData.dataValues.email = newEmail;
        userData.dataValues.emailVerify = false;
        // console.log(userData.dataValues);
        const wasUpdated = await userManager.updateUser(userData.dataValues.userId, userData.dataValues);
        if (wasUpdated) {
          await interaction.reply({ content: `Đã cập nhật email của người dùng ${user.tag} thành ${newEmail}`, ephemeral: true });
        } else {
          await interaction.reply({ content: 'Không tìm thấy email của người dùng!', ephemeral: true });
        }
      } else {
        await interaction.reply({ content: 'Không tìm thấy người dùng!', ephemeral: true });
      }
      
    } catch (error) {
      console.error('Lỗi khi thay đổi email:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi thay đổi email!', ephemeral: true });
    }
  },
};
