const { SlashCommandBuilder } = require('@discordjs/builders');
const { banLogChannelId, banyetkili, serverbanner, servericon } = require('../../config/Guild.Config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yargı')
        .setDescription('Bir kullanıcıyı banlar.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Banlanacak kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Ban sebebi')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(banyetkili)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('sebep');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: 'Bu kullanıcı sunucuda bulunmuyor!',
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content: 'Bu kullanıcıyı yasaklayamıyorum! Daha yüksek bir yetkiye sahip olabilir.',
                ephemeral: true
            });
        }

        await member.ban({ reason });

        const embed = new MessageEmbed()
            .setColor('#2c05ba')
            .setDescription(`${user.tag} **sunucumuzdan yasaklandı.**`)
            .addFields(
                { name: 'Yasaklayan Yetkili', value: `${interaction.user.tag}`, inline: true },
                { name: 'Sebep', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Yasaklanan Kullanıcı: ${user.tag}`, iconURL: user.displayAvatarURL() })
            .setImage(serverbanner || 'default_image_url') 
            .setThumbnail(servericon || 'default_icon_url') 
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });

        const logChannel = interaction.guild.channels.cache.get(banLogChannelId);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Yasaklama İşlemi')
                .setDescription(`**Kullanıcı:** ${user.tag}\n**Yasaklayan Yetkili:** ${interaction.user.tag}\n**Sebep:** ${reason}`)
                .setTimestamp()
                .setImage(serverbanner || 'default_image_url')
                .setThumbnail(servericon || 'default_icon_url')
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};
