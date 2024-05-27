const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const userManager = require('../../database/userManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-email')
    .setDescription('Kiểm tra email của người dùng bằng Discord ID')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Chọn người dùng để kiểm tra email')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), 

  async execute(interaction) {
    const user = interaction.options.getUser('user'); 
    try {
      const userInfo = await userManager.getUser(user.id);

      if (userInfo && userInfo.emailVerify) {
        await interaction.reply({ content: `Email của người dùng ${user.tag} là: ${userInfo.email}`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'Không tìm thấy email của người dùng này!', ephemeral: true });
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra email:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi kiểm tra email!', ephemeral: true });
    }
  },
};
