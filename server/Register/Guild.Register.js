const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { unregisterRolId, whitelistRolId, registerLogChannelId, hexIdChannelId } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kaydet')
        .setDescription('Kullanıcıyı kaydeder.')
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Kaydedilecek üye')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('steamprofil')
                .setDescription('Kullanıcının Steam profili')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hexid')
                .setDescription('Kullanıcının FiveM Hex ID\'si')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('fivemsaati')
                .setDescription('Kullanıcının FiveM saati')
                .setRequired(true)),

    async execute(interaction) {
        const üye = interaction.options.getUser('üye');
        const steamprofil = interaction.options.getString('steamprofil');
        const hexid = interaction.options.getString('hexid');
        const fivemsaati = interaction.options.getInteger('fivemsaati');
        const yetkili = interaction.user;
        const member = await interaction.guild.members.fetch(üye.id);
        const unregisterRol = member.roles.cache.get(unregisterRolId);
        const whitelistRol = interaction.guild.roles.cache.get(whitelistRolId);

        if (unregisterRol) {
            await member.roles.remove(unregisterRol);
        }
        if (whitelistRol) {
            await member.roles.add(whitelistRol);
        }

        const logEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle('ʏᴇɴɪ ᴋᴀʏıᴛ ɪ̇şʟᴇᴍɪ')
            .setDescription(`ᴋᴀʏıᴛ ɪşʟᴇᴍɪ ʙᴀşᴀʀıʟı!`)
            .addField('ᴋᴜʟʟᴀɴıᴄı', `${üye}`, true)
            .addField('sᴛᴇᴀᴍ ᴘʀᴏғɪʟ', steamprofil, true)
            .addField('ʜᴇx ɪᴅ', hexid, true)
            .addField('ғɪᴠᴇᴍ sᴀᴀᴛɪ', fivemsaati.toString(), true)
            .addField('ᴋᴀʏıᴛ ʏᴀᴘᴀɴ ʏᴇᴛᴋɪʟɪ', `${yetkili}`, true)
            .setFooter('ᴋᴀʏıᴛ ʟᴏɢᴜ', interaction.client.user.avatarURL())
            .setTimestamp();

        const logChannel = interaction.guild.channels.cache.get(registerLogChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        const hexIdChannel = interaction.guild.channels.cache.get(hexIdChannelId);
        if (hexIdChannel) {
    hexIdChannel.send(`${üye} Hex ID: ${hexid}`);
        }

        await member.setNickname("IC ISIM")
        await interaction.reply({
            content: `${üye} ʙᴀşᴀʀıʏʟᴀ ᴋᴀʏᴅᴇᴅɪʟᴅɪ!`,
            ephemeral: true
        });
    },
};
