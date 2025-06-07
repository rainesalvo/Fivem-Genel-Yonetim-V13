const { MessageEmbed } = require('discord.js');
const { staffYetkisi } = require('../config/Guild.Config.json');
const badWords = require('../config/badwords.json').badWords;
const cooldowns = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const member = message.guild.members.cache.get(message.author.id);
        const isStaff = member && member.roles.cache.some(role => staffYetkisi.includes(role.id));

        if (isStaff) return;

        const messageContent = message.content.toLowerCase();
        let isBadWordFound = false;

        badWords.forEach(word => {
            if (messageContent.includes(word)) {
                isBadWordFound = true;
            }
        });

        if (isBadWordFound) {
            await message.delete();

            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author}, küfürlü kelimeler kullanmak yasaktır! Mesajınız silindi.`);

            const warningMessage = await message.channel.send({ embeds: [embed] });

            setTimeout(() => {
                warningMessage.delete();
            }, 5000);

            if (!cooldowns.has(message.author.id)) {
                cooldowns.set(message.author.id, { count: 1, timeout: Date.now() });
            } else {
                const userData = cooldowns.get(message.author.id);
                userData.count += 1;

                if (userData.count >= 3 && Date.now() - userData.timeout < 900000) {
                    const banTime = 15 * 60 * 1000;
                    const memberToMute = message.guild.members.cache.get(message.author.id);
                    
                    await memberToMute.timeout(banTime, 'Küfürlü kelime kullanımı limitini aştı.');

                    message.channel.send(`${message.author} 15 dakika boyunca susturuldu çünkü 3 kez küfürlü kelime kullandı.`);
                    cooldowns.delete(message.author.id);
                } else {
                    cooldowns.set(message.author.id, { ...userData, timeout: Date.now() });
                }
            }
        }
    },
};
