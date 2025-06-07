const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription('Bottaki komutları gösterir.'),

    async execute(interaction) {
        const { client } = interaction;
        
        const categories = {
            'Developer Komutları': [],
            'Kurucu Komutları': [],
            'Yetkili Komutları': [],
        };

        client.commands.forEach(command => {
            if (command.data.category === 'Developer') {
                categories['Developer Komutları'].push(`**/${command.data.name}** - ${command.data.description}`);
            } else if (command.data.category === 'Kurucu') {
                categories['Kurucu Komutları'].push(`**/${command.data.name}** - ${command.data.description}`);
            } else {
                categories['Yetkili Komutları'].push(`**/${command.data.name}** - ${command.data.description}`);
            }
        });

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bot Komutları')
            .setDescription('Aşağıda botun sunduğu komutları bulabilirsiniz:');

        for (const [category, commands] of Object.entries(categories)) {
            if (commands.length > 0) {
                embed.addField(category, commands.join('\n'), true);
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
