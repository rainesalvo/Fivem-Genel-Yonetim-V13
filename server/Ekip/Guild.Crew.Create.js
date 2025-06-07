const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ekiplog, ekipkatagori, staffYetkisi } = require('../../config/Guild.Config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ekipaç')
        .setDescription('Ekip açma komutu.')
        .addStringOption(option =>
            option.setName('ekipismi')
                .setDescription('Ekip isminde yazılacak ismi girin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('renk')
                .setDescription('Ekip için renk seçin.')
                .setRequired(true)
                .addChoices(
                    { name: 'Red', value: '#FF0000' },
                    { name: 'Green', value: '#00FF00' },
                    { name: 'Blue', value: '#0000FF' },
                    { name: 'Yellow', value: '#FFFF00' },
                    { name: 'Purple', value: '#800080' },
                    { name: 'Orange', value: '#FFA500' },
                    { name: 'Pink', value: '#FFC0CB' },
                    { name: 'Gray', value: '#808080' },
                    { name: 'Black', value: '#000000' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Brown', value: '#A52A2A' },
                    { name: 'Cyan', value: '#00FFFF' },
                    { name: 'Magenta', value: '#FF00FF' },
                    { name: 'Lime', value: '#00FF00' },
                    { name: 'Teal', value: '#008080' },
                    { name: 'Maroon', value: '#800000' },
                    { name: 'Olive', value: '#808000' },
                    { name: 'Indigo', value: '#4B0082' },
                    { name: 'Gold', value: '#FFD700' },
                    { name: 'Silver', value: '#C0C0C0' },
                )
        )
        .addUserOption(option =>
            option.setName('patron')
                .setDescription('Ekip patronunu seçin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('üye')
                .setDescription('Ekip üyeleri ID olarak girin, virgülle ayırın.')
                .setRequired(true)),
    
    async execute(interaction) {
            if (!interaction.member.roles.cache.has(staffYetkisi)) {
                return interaction.reply({
                    content: 'Bu komutu kullanabilmek için gerekli yetkiye sahip değilsiniz!',
                    ephemeral: true
                });
            }
        const teamName = interaction.options.getString('ekipismi');
        const color = interaction.options.getString('renk');
        const patron = interaction.options.getUser('patron');
        const memberIds = interaction.options.getString('üye').split(',').map(id => id.trim());

        const guild = interaction.guild;
        let role = await guild.roles.create({
            name: teamName,
            color: color, 
            mentionable: true,
        });

        const members = [];
        for (let memberId of memberIds) {
            try {
                let member = await guild.members.fetch(memberId);
                await member.roles.add(role);
                members.push(member);
            } catch (error) {
                console.error(`Üye eklenemedi: ${memberId}`);
            }
        }

        const patronMember = await guild.members.fetch(patron.id);
        await patronMember.roles.add(role);

        const category = guild.channels.cache.get(ekipkatagori);

        const ticketChannel = await guild.channels.create(`${teamName}-sınırsız`, {
            type: 'GUILD_TEXT',
            parent: category.id,
            permissionOverwrites: [
                {
                    id: guild.id, 
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: role.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    id: patron.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ],
        });

        const embed = new MessageEmbed()
        .setDescription(` ${role} 𝐄𝐤𝐢𝐛𝐢 𝐀𝐫𝐚𝐦ı𝐳𝐚 𝐇𝐨𝐬̧ 𝐆𝐞𝐥𝐝𝐢𝐧𝐢𝐳!
                    
         ᴇᴋɪᴘ ʙᴀşᴀʀıʟı ʙɪʀ şᴇᴋɪʟᴅᴇ ᴏʟᴜşᴛᴜʀᴇᴄᴋᴇ! ᴇᴋɪᴘ ᴘᴀᴛʀᴏɴᴜ: <@${patron.id}>`)
        .setColor(color)
        .setTimestamp();
    
    if (members.length > 0) {
        embed.addField(
            ' ᴇᴋɪᴘ ᴜ̈ʏᴇʟᴇʀɪ:',
            members.map(member => `<@${member.id}> (ID: ${member.id})`).join('\n')
        );
    } else {
        embed.addField(' ᴇᴋɪᴘ ᴜ̈ʏᴇʟᴇʀɪ:', 'Bu ekibin üyesi yok.');
    }
    
    

        await ticketChannel.send({ embeds: [embed] });
        await interaction.reply({
            content: `${role} ᴇᴋɪʙɪ ʙᴀşᴀʀıʏʟᴀ ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ! ᴛɪᴄᴋᴇᴛ ᴋᴀɴᴀʟı: <#${ticketChannel.id}>`,
            ephemeral: true,
        });

        const logChannel = guild.channels.cache.get(ekiplog);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setTitle('ʏᴇɴɪ ᴇᴋɪᴘ ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ')
                .setDescription(`ʏᴇɴɪ ᴇᴋɪᴘ: **${role}** ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ. ᴘᴀᴛʀᴏɴ: <@${patron.id}>`)
                .setColor(color)
                .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] });
        }
    },
};
