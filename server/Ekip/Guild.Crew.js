const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { serverbanner, servericon, staffYetkisi } = require('../../config/Guild.Config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ekip')
        .setDescription('Ekip bilgilerini gösterir.')
        .addRoleOption(option =>
            option.setName('ekiprol')
                .setDescription('Ekip rolünü seçin.')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(staffYetkisi)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }
        const role = interaction.options.getRole('ekiprol');
        const guild = interaction.guild;

        const members = role.members;
        const membersList = [];
        let patron = null;

        members.forEach(member => {
            if (member.roles.cache.has(role.id)) {
                if (member.id === role.id) {
                    patron = member;
                } else {
                    membersList.push(member);
                }
            }
        });

        const embed = new MessageEmbed()
            .setDescription(`${role} 𝐄𝐤𝐢𝐛𝐢𝐧𝐞 𝐀𝐢𝐭 𝐁𝐢𝐥𝐠𝐢𝐥𝐞𝐫;`)
            .setColor(role.color)
            .setImage(serverbanner || 'default_image_url') 
            .setThumbnail(servericon || 'default_icon_url') 
            .setTimestamp();

        if (patron) {
            embed.addField('ᴇᴋɪᴘ ᴘᴀᴛʀᴏɴᴜ:', `<@${patron.id}> (${patron.id})`);
        } else {
            embed.addField('ᴇᴋɪᴘ ᴘᴀᴛʀᴏɴᴜ:', 'Patron bulunamadı');
        }

        if (membersList.length > 0) {
            embed.addField('ᴇᴋɪᴘ ᴜ̈ʏᴇʟᴇʀɪ:', membersList.map(member => `<@${member.id}> (${member.id})`).join('\n'));
        } else {
            embed.addField('ᴇᴋɪᴘ ᴜ̈ʏᴇʟᴇʀɪ:', 'Bu ekibin üyesi yok.');
        }

        await interaction.reply({ embeds: [embed] });
    },
};
