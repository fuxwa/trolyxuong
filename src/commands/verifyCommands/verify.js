const { SlashCommandBuilder } = require('discord.js');
const userManager = require('../../database/userManager');
const verifyManager = require('../../database/verifyManager');
const Email = require('../../email');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Xác minh email của bạn')
    .addStringOption(option => 
      option.setName('email')
        .setDescription('Nhập email của bạn')
        .setRequired(true)),
  async execute(interaction) {
    const email = interaction.options.getString('email'); 
    const discordId = interaction.user.id; 
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
      return interaction.reply({ content: 'Email không hợp lệ!', ephemeral: true });
    }
	const code = Math.floor(100000 + Math.random() * 900000).toString();
	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: email,
		subject: 'Mã xác thực Discord',
		text: `Mã xác thực Discord của bạn là: ${code}. Dùng lệnh /verify-code ${code} tại server discord để xác minh`
	};
    try {
		const user = await userManager.getUser(discordId);
		if(!user) {
			await userManager.addUser(discordId, email);
			await verifyManager.addVerify(discordId, email, code)
			
			Email.sendMail(mailOptions, interaction);
			await interaction.reply({ content: `Đã gửi mã xác thực đến ${email}. Vui lòng kiểm tra email của bạn.`, ephemeral: true });
			
		} else {
			if(user.emailVerify) {
				await interaction.reply({ content: `Bạn đã xác minh email rồi !`, ephemeral: true }); 
			} else {
				const verify = await verifyManager.getVerify(discordId,email)
				if (verify) {
					const now = new Date();
					const createdAt = new Date(verify?.dataValues?.createdAt);
					const timeDiff = now - createdAt;
					const minutesDiff = Math.floor(timeDiff / (1000 * 60));
		  
					if (minutesDiff >= 5) {
						await verifyManager.addVerify(discordId, email, code)
						user.dataValues.email = email;
						userManager.updateUser(user.userId, user.dataValues)
						Email.sendMail(mailOptions, interaction);
						await interaction.reply({ content: `Đã gửi mã xác thực đến ${email}. Vui lòng kiểm tra email của bạn.`, ephemeral: true });
					  
					} else {
						return await interaction.reply({ content: 'Vui lòng kiểm tra email của bạn trước khi gửi lại yêu cầu !', ephemeral: true });
					}
				}
			}
		}
    } catch (error) {
      console.error('Lỗi khi gửi email xác minh:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi xác minh email!', ephemeral: true });
    }
  },
};
