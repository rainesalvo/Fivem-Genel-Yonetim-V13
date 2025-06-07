const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { staffYetkisi } = require('../../config/Guild.Config.json'); 

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('İC İsim Reddet')
        .setType(2),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(staffYetkisi)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için `StaffYetkili` rolüne sahip olmanız gerekiyor!',
                ephemeral: true,
            });
        }

        const targetUser = interaction.targetUser;

        await interaction.reply({
            content: `${targetUser} reddedildi. Hiçbir işlem yapılmadı.`,
            ephemeral: true,
        });

        const channel = interaction.channel;
        await channel.send(`${targetUser} İC İsmin Yetkililer Tarafından Reddedildi!`);
    },
};
