const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { botdeveloperrol, logKategoriAdi, logKanallari } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logkur')
        .setDescription('Yeni bir log kategorisi oluşturur ve kanallar ekler.'),

    async execute(interaction) {
        try {

            await interaction.deferReply({ ephemeral: true });

            if (!interaction.member.permissions.has(botdeveloperrol)) {
                return interaction.followUp({
                    content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                    ephemeral: true
                });
            }

            const category = await interaction.guild.channels.create(logKategoriAdi, {
                type: 'GUILD_CATEGORY',
                position: 1,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                ],
            });

            const adminRole = interaction.guild.roles.cache.find(role => role.permissions.has('ADMINISTRATOR'));

            if (!adminRole) {
                return interaction.followUp({
                    content: 'Administrator rolü bulunamadı, lütfen rolün adını kontrol edin.',
                    ephemeral: true
                });
            }

            for (const kanalAdı of logKanallari) {
                await interaction.guild.channels.create(kanalAdı, {
                    type: 'GUILD_TEXT',
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['VIEW_CHANNEL'], 
                        },
                        {
                            id: adminRole.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        }
                    ],
                });
            }

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Log Kategorisi ve Kanallar Başarıyla Oluşturuldu!')
                .setDescription(`Yeni log kategorisi ve kanallar başarıyla oluşturuldu. \nKategori: **${logKategoriAdi}**`)
                .addFields(
                    { name: 'Oluşturulan Kanallar', value: logKanallari.join(', '), inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Log kurulumu' });

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('Log kurma sırasında hata oluştu:', error);
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: 'Bu komut çalıştırılırken bir hata oluştu!',
                    ephemeral: true
                });
            }

            return interaction.followUp({
                content: 'Bir hata oluştu, tekrar deneyin.',
                ephemeral: true
            });
        }
    }
};
