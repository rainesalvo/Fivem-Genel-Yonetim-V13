const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { staffYetkisi, rollogcahnnelid, serverbanner, servericon } = require('../../config/Guild.Config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolal')
        .setDescription('Bir kullanıcıdan rol alır.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Rol alınacak kullanıcı')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Alınacak rol')
                .setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için **Rolleri Yönet** yetkisine sahip olmalısınız!',
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

        await member.roles.remove(role);

        const logChannel = interaction.guild.channels.cache.get(rollogcahnnelid);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Rol Alma İşlemi')
                .setDescription(`**Kullanıcıdan Rol Alındı:** ${role.name}`)
                .addField('İşlem Yapan', `${interaction.user} (${interaction.user.tag})`, true)
                .addField('Kullanıcı', `${user} (${user.tag})`, true)
                .addField('Alınan Rol', `${role.name}`, true)
                .setTimestamp()
                .setImage(serverbanner || 'default_image_url')
                .setThumbnail(servericon || 'default_icon_url')
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());

            logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply({
            content: `${role.name} rolü başarıyla ${user} (${user.tag}) adlı kullanıcıdan alındı.`,
            ephemeral: true
        });
    }
};
