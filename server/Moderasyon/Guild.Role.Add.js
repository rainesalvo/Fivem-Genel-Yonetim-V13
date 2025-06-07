const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { staffYetkisi, rollogcahnnelid, serverbanner, servericon } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolver')
        .setDescription('Bir kullanıcıya rol verir.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Rol verilecek kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Verilecek rol')
                .setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.permissions.has(staffYetkisi)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('rol');
        const member = await interaction.guild.members.fetch(user.id);
        
        if (!member) {
            return interaction.reply({
                content: 'Bu kullanıcı sunucuda değil.',
                ephemeral: true
            });
        }

        if (interaction.member.roles.highest.position <= role.position) {
            return interaction.reply({
                content: 'Kendi üstündeki bir rolü başkasına veremezsin!',
                ephemeral: true
            });
        }

        await member.roles.add(role);

        const logChannel = interaction.guild.channels.cache.get(rollogcahnnelid);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Rol Verme İşlemi')
                .setDescription(`**Kullanıcıya Rol Verildi:** ${role.name}`)
                .addField('İşlem Yapan', `${interaction.user} (${interaction.user.tag})`, true)
                .addField('Kullanıcı', `${user} (${user.tag})`, true)
                .addField('Verilen Rol', `${role.name}`, true)
                .setTimestamp()
                .setImage(serverbanner || 'default_image_url')
                .setThumbnail(servericon || 'default_icon_url')
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

            logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply({
            content: `${role.name} rolü başarıyla ${user} (${user.tag}) adlı kullanıcıya verildi.`,
            ephemeral: true
        });
    }
};
