const { SlashCommandBuilder } = require('@discordjs/builders');
const { banyetkili } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirtilen kadar mesajı siler.')
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Silinecek mesaj sayısı')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(banyetkili)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }

        const amount = interaction.options.getInteger('miktar');

        if (amount > 100) {
            return interaction.reply({
                content: 'Bir seferde en fazla 100 mesaj silebilirsiniz.',
                ephemeral: true
            });
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({
                content: `${amount} mesaj başarıyla silindi.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Mesajları silerken bir hata oluştu.',
                ephemeral: true
            });
        }
    }
};
