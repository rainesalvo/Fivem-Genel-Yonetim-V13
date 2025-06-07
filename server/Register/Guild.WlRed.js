const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { unregisterRolId, whitelistRolId, rejectLogChannelId } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('red')
        .setDescription('Kullanıcının whitelist başvurusunu reddeder.')
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Whitelist başvurusu reddedilecek üye')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Red sebebini belirtin')
                .setRequired(true)),

    async execute(interaction) {
        const üye = interaction.options.getUser('üye');
        const sebep = interaction.options.getString('sebep');
        const yetkili = interaction.user;
        const member = await interaction.guild.members.fetch(üye.id);
        const unregisterRol = interaction.guild.roles.cache.get(unregisterRolId);
        const whitelistRol = member.roles.cache.get(whitelistRolId);

        if (whitelistRol) {
            await member.roles.remove(whitelistRol);
        }
        if (unregisterRol) {
            await member.roles.add(unregisterRol);
        }

        await member.setNickname("İsim Alınamadı");

        const logEmbed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle('ᴡʜɪᴛᴇʟɪsᴛ ʀᴇᴅᴅᴇᴅɪʟᴅɪ')
            .setDescription(`ᴡʜɪᴛᴇʟɪsᴛ ʙᴀşᴠᴜʀᴜsᴜ ʀᴇᴅᴅᴇᴅɪʟᴅɪ!`)
            .addField('ᴋᴜʟʟᴀɴıᴄı', `${üye}`, true)
            .addField('ʀᴇᴅ sᴇʙᴇʙɪ', sebep, true)
            .addField('ʀᴇᴅ ᴠᴇʀᴇɴ ʏᴇᴛᴋɪʟɪ', `${yetkili}`, true)
            .setFooter('ʀᴇᴅ ʟᴏɢᴜ', interaction.client.user.avatarURL())
            .setTimestamp();

        const logChannel = interaction.guild.channels.cache.get(rejectLogChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply({
            content: `${üye} kullanıcısının whitelist başvurusu **"${sebep}"** sebebiyle reddedildi!`,
            ephemeral: true
        });
    },
};
