const { SlashCommandBuilder } = require('@discordjs/builders');
const { banKaldırmaLog, serverbanner, servericon, banyetkili } = require('../../config/Guild.Config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yargıkaldır')
        .setDescription('Bir kullanıcının banını kaldırır.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Banı kaldırılacak kullanıcı')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(banyetkili)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }
        const user = interaction.options.getUser('user');
        
        try {

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: 'Bu kullanıcı sunucuda değil veya banı zaten kaldırılmış.',
                    ephemeral: true
                });
            }

            await member.unban();

            const embed = new MessageEmbed()
                .setColor('#2c05ba')
                .setDescription(`${user.tag} **sᴜɴᴜᴄᴜᴍᴜᴢᴅᴀɴ ʙᴀɴı ᴋᴀʟᴅıʀıʟᴅı.**`)
                .addFields(
                    { name: 'ʙᴀɴı ᴋᴀʟᴅıʀᴀɴ ʏᴇᴛᴋɪʟɪ', value: `${interaction.user}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `ʙᴀɴı ᴋᴀʟᴅıʀıʟᴅıᴋᴀɴ ᴋᴜʟʟᴀɴıᴄı: ${user.tag}`, iconURL: user.displayAvatarURL() })
                .setImage(serverbanner || 'default_banner_url')
                .setThumbnail(servericon || 'default_icon_url')
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

            embed.addField('ʙᴀɴı ᴋᴀʟᴅıʀıʟᴅıᴋᴀɴ', `${user}`, true);

            await interaction.reply({ embeds: [embed] });

            const logChannel = interaction.guild.channels.cache.get(banKaldırmaLog);
            if (logChannel) {
                const logEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('ʙᴀɴ ᴋᴀʟᴅıʀᴍᴀ ɪ̇şʟᴇᴍɪ')
                    .setDescription(`**ᴋᴜʟʟᴀɴıᴄı:** ${user.tag}\n**ʏᴇʏᴛᴋɪʟɪ:** ${interaction.user.tag}`)
                    .setTimestamp()
                    .setImage(serverbanner || 'default_banner_url')
                    .setThumbnail(servericon || 'default_icon_url')
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());
                logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'ʙᴀɴı ᴋᴀʟᴅıʀıʟᴅıᴋᴀɴᴋᴇ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ.',
                ephemeral: true
            });
        }
    }
};
