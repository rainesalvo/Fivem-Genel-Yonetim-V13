const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { staffYetkisi, icIsimChannelId } = require('../../config/Guild.Config.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('İC İsim Onayla')
        .setType(2),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(staffYetkisi)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için `StaffYetkili` rolüne sahip olmanız gerekiyor!',
                ephemeral: true,
            });
        }

        const targetUser = interaction.targetUser;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const icIsimChannel = interaction.guild.channels.cache.get(icIsimChannelId);
        
        if (!icIsimChannel) {
            return interaction.reply({
                content: "'IC İsim' kanal ID'si bulunamadı!",
                ephemeral: true,
            });
        }

        const messages = await icIsimChannel.messages.fetch({ limit: 10 });

        const lastMessage = messages
            .filter(message => message.author.id === targetUser.id)
            .first();

        if (!lastMessage) {
            return interaction.reply({
                content: 'Bu kullanıcının IC İsim kanalındaki yazdığı bir mesaj bulunamadı!',
                ephemeral: true,
            });
        }

        let newName = lastMessage.content;

        newName = newName.replace(/[^a-zA-Z0-9 ]/g, '');

        if (newName.length > 32) {
            newName = newName.substring(0, 32);
            console.log(`İsim çok uzun, 32 karakterle sınırlandırıldı: ${newName}`);
        }

        await member.setNickname(newName);

        await interaction.channel.send(`${targetUser} IC İsim Yetkililerimiz Tarafından Onaylandı Ve İsmin "${newName}" Olarak Değiştirildi!`);

        await interaction.reply({
            content: `${targetUser} IC İsim Yetkililerimiz Tarafından Onaylandı Ve İsmin "${newName}" Olarak Değiştirildi!`,
            ephemeral: true,
        });
    },
};
