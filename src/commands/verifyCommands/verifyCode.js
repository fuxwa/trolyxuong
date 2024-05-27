const { SlashCommandBuilder } = require('discord.js');
const verifyManager = require('../../database/verifyManager');
const userManager = require('../../database/userManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-code')
    .setDescription('Xác minh mã code từ email')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Nhập mã code')
        .setRequired(true)),

  async execute(interaction) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;

    try {
      const verify = await verifyManager.getVerifyByCode(discordId, code);
      const user = await userManager.getUser(discordId);

      if (!verify) {
        return interaction.reply({ content: 'Mã xác minh không hợp lệ!', ephemeral: true });
      }
      if(!user) {
        return interaction.reply({ content: 'Bạn chưa yêu cầu mã xác minh!', ephemeral: true });
      }
      if(user?.dataValues?.emailVerify) {
        return interaction.reply({ content: 'Bạn đã xác minh rồi mà!', ephemeral: true });
      }
      
    //   if (verify.code !== code) {
    //     return interaction.reply({ content: 'Mã xác minh không đúng!', ephemeral: true });
    //   }
    const now = new Date();
    const createdAt = new Date(verify?.dataValues?.createdAt);
    const timeDiff = now - createdAt;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff >= 5) {
        await interaction.reply({ content: `Mã xác thực đã hết hạn`, ephemeral: true });
    } else {
        user.dataValues.emailVerify = true;
        await userManager.updateUser(user.userId, user.dataValues)
        return await interaction.reply({ content: 'Đã xác thực!', ephemeral: true });
    }

      // Lưu thông tin người dùng vào cơ sở dữ liệu (nếu cần)
    //   await userManager.addUser(userId, interaction.user.username, interaction.user.discriminator);

      await verifyManager.removeVerify(discordId, user.dataValues.email, code); 

      await interaction.reply({ content: 'Xác minh thành công!', ephemeral: true });
    } catch (error) {
      console.error('Lỗi khi xác minh mã code:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi xác minh mã code!', ephemeral: true });
    }
  },
};
