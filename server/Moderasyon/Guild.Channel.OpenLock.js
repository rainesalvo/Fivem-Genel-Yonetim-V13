const { SlashCommandBuilder } = require('@discordjs/builders');
const { banyetkili } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kilitaç')
        .setDescription('Bu kanalı açar ve herkesin mesaj göndermesini sağlar.'),

    async execute(interaction) {
        if (!interaction.member.permissions.has(banyetkili)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }
        const channel = interaction.channel;

        await channel.permissionOverwrites.edit(channel.guild.id, {
            SEND_MESSAGES: true,
        });

        await interaction.reply({ content: 'Kanal başarıyla açıldı.', ephemeral: true });
    }
};
