const { SlashCommandBuilder } = require('@discordjs/builders');
const { muteLogChannel, serverbanner, servericon, muteyetkili } = require('../../config/Guild.Config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Bir kullanıcının mesajlaşmasını ve sesli sohbete katılmasını yasaklar.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mute uygulanacak kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Mute uygulama sebebi')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('sure')
                .setDescription('Mute süresi (dakika olarak)')
                .setRequired(true)
                .addChoices(
                    { name: '5 Dakika', value: 5 },
                    { name: '10 Dakika', value: 10 },
                    { name: '15 Dakika', value: 15 },
                    { name: '30 Dakika', value: 30 },
                    { name: '1 Saat', value: 60 },
                    { name: '2 Saat', value: 120 },
                    { name: '1 Gün', value: 1440 }
                )),

                async execute(interaction) {
                    if (!interaction.member.permissions.has(muteyetkili)) {
                        return interaction.reply({
                            content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                            ephemeral: true
                        });
                    }
                
                    const user = interaction.options.getUser('user');
                    const reason = interaction.options.getString('sebep');
                    const duration = interaction.options.getInteger('sure');
                
                    if (duration <= 0) {
                        return interaction.reply({
                            content: 'Geçerli bir süre girin (pozitif bir sayı).',
                            ephemeral: true
                        });
                    }
                
                    const time = duration * 60 * 1000;
                
                    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
                
                    if (!member) {
                        return interaction.reply({
                            content: 'Bu kullanıcı sunucuda değil.',
                            ephemeral: true
                        });
                    }
                                

        try {
            await member.timeout(time, reason);

            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${user.tag} **süresiz olarak susturuldu.**`)
                .addFields(
                    { name: 'Sebep', value: reason, inline: true },
                    { name: 'Süre', value: `${duration} dakika`, inline: true },
                    { name: 'Yetkili', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Mute uygulama tarihi`, iconURL: user.displayAvatarURL() })
                .setImage(serverbanner || 'default_banner_url')
                .setThumbnail(servericon || 'default_icon_url')
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

            await interaction.reply({ embeds: [embed] });

            const logChannel = interaction.guild.channels.cache.get(muteLogChannel);
            if (logChannel) {
                const logEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('ʏᴇᴛᴋɪʟɪ ᴍᴜᴛᴇ ɪ̇şʟᴇᴍɪ')
                    .setDescription(`**Kullanıcı:** ${user.tag}\n**Sebep:** ${reason}\n**Süre:** ${duration} dakika\n**Yetkili:** ${interaction.user.tag}`)
                    .setTimestamp()
                    .setImage(serverbanner || 'default_banner_url')
                    .setThumbnail(servericon || 'default_icon_url')
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());
                logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Mute işlemi sırasında bir hata oluştu.',
                ephemeral: true
            });
        }
    }
};
