const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
    async execute(client) {
		// const res = await checkLicense(LICENSEKEY,'HMCore','1.0.1')
		// if(res) {
		// 	console.log('Your bot is verify')
		// 	console.log('License as '+res.discord_tag+' Expire Date: '+res.expire_date )
			console.log(`Logged in as ${client.user.tag}`);
		// } else {
		// 	console.log('INVALID LICENSE')
		// 	client.destroy()
		// }
		
	},
};