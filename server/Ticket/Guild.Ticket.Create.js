const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { servername, serverbanner, servericon, kurallarkanalid, ticketkanalid, botdeveloperrol } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-kur')
        .setDescription('Ticket kurulum panelini açar.'),
    
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(botdeveloperrol)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }

        const embed = new MessageEmbed()
            .setColor("#5100ff")
            .setTitle(`${servername} ᴅᴇsᴛᴇᴋ ᴇᴋɪʙɪ`)
            .setDescription(`<a:KONFETS:1279917437592010753> sᴜɴᴜᴄᴜᴍᴜᴢᴅᴀ ᴅᴇsᴛᴇᴋ ᴏʟᴜşᴛᴜʀᴀʙɪʟᴍᴇᴋ ɪᴄ̧ɪɴ ᴀşᴀɢ̆ıᴅᴀᴋɪ ᴍᴇɴᴜ'ᴅᴇɴ ᴋᴀᴛᴀɢᴏʀɪ sᴇᴄ̧ᴍᴇɴɪᴢ ɢᴇʀᴇᴋᴍᴇᴋᴛᴇᴅɪʀ.
            
            <a:zyphora_elmas:1279926186960621700> 'ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ: <:OnaylanmPng:1279919802814562427>
            <a:ayar1:1279919139036860562> 'ᴛɪᴄᴋᴇᴛ sᴀᴀᴛʟᴀʀɪ: 𝟏𝟐:𝟎𝟎/𝟎𝟎:𝟎𝟎
            <:emoji_1311:1279919079842644102> 'sᴜɴᴜᴄᴜ ʙɪʟɢɪsɪ: <#${kurallarkanalid}>
            <:YldzPng:1279918491662553198> 'ᴛɪᴄᴋᴇᴛ ɪᴄ̧ᴇʀɪsɪɴᴅᴇ ᴋᴏɴᴜɴᴜᴢᴜ ʙᴇʟɪʀᴛɪɴɪᴢ ᴠᴇ sᴀʙıʀʟı ʙɪʀ şᴇᴋɪʟᴅᴇ ʏᴇᴛᴋɪʟɪʟᴇʀɪɴ ɪʟɢɪʟᴇɴᴍᴇsɪɴɪ ʙᴇᴋʟᴇʏɪɴɪᴢ. <#${ticketkanalid}>`)
            .setFooter('Ticket Sistemi', interaction.client.user.avatarURL())
            .setImage(serverbanner)
            .setThumbnail(servericon)
            .setTimestamp();

        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('ticket_select')
                    .setPlaceholder('Bir ticket türü seçin...')
                    .addOptions([
                        {
                            label: 'Donate Mekan',
                            description: 'Donate Mekan',
                            emoji: "1279918491662553198",
                            value: 'ooc_ticket',
                        },
                        {
                            label: 'Telefon No',
                            description: 'Telefon No',
                            emoji: "1279918491662553198",
                            value: 'ic_ticket',
                        },
                        {
                            label: 'Özel Plaka',
                            description: 'Özel Plaka',
                            emoji: "1279918491662553198",
                            value: 'anticheat_ticket',
                        },
                        {
                            label: 'Donate Araç',
                            description: 'Donate Araç',
                            emoji: "1279918491662553198",
                            value: 'general_ticket',
                        },
                    ])
            );

        await interaction.reply({
            embeds: [embed],
            components: [selectMenu],
        });
    },
};
