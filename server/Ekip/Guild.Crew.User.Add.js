const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { staffYetkisi } = require('../../config/Guild.Config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ekipüye')
        .setDescription('Ekip üyeleri ekler.')
        .addRoleOption(option =>
            option.setName('ekiprol')
                .setDescription('Ekip rolünü seçin.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('üye')
                .setDescription('Eklemek istediğiniz üyeyi seçin.')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(staffYetkisi)) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                ephemeral: true
            });
        }
        const role = interaction.options.getRole('ekiprol');
        const member = interaction.options.getUser('üye');

        const guild = interaction.guild;
        const memberToAdd = await guild.members.fetch(member.id);

        await memberToAdd.roles.add(role);

        const embed = new MessageEmbed()
            .setDescription(`${role} Ekibine <@${member.id}> Başarıyla Eklendi.`)
            .setColor(role.color)

        await interaction.reply({ embeds: [embed] });
    },
};
