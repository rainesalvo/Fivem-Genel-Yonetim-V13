const { SlashCommandBuilder } = require('@discordjs/builders');
const { serverbanner, servericon, serverurl, servername, fivemip } = require('../../config/Guild.Config.json');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bakım')
        .setDescription('Sunucuyu bakım moduna alır'),
    async execute(interaction) {
        await interaction.deferReply();

        const button = new MessageButton()
            .setStyle('LINK')
            .setLabel('Fivem Bağlan')
            .setEmoji('1279918617647120436')
            .setURL(`https://cfx.re/join/${serverurl}`);

        const row = new MessageActionRow().addComponents(button);

        const embed = new MessageEmbed()
            .setTitle(servername)
            .setURL(serverurl)
            .setThumbnail(servericon)
            .setDescription(`<a:KONFETS:1279917437592010753> *Sunucumuz* **Bakım** *Durumuna geçmiş* 
                *bulunmaktadır, aşağıda bulunan link ve 
                butonlardan sunucumuza kısa bir süre içerisinde 
                bağlantı yapabilirsiniz iyi oyunlar iyi eğlenceler
                dileriz.*

                <:YldzPng:1279918491662553198> \`ᴅᴜʀᴜᴍ:\` (🟠)
                <a:ayar1:1279919139036860562> \`ᴋᴜʀᴜʟᴜᴍ:\` null

                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

                <:zyphorafivem:1279918617647120436> \`ꜰıᴠᴇᴍ: connect (${fivemip}) \`
                <:tszpyhora:1279918716083114117> \`ᴛꜱ:\` null

                <:zyphorafivem:1279918617647120436> \`ꜰıᴠᴇᴍ:\` [Hızlı Bağlan](https://cfx.re/join/${serverurl})
                <:tszpyhora:1279918716083114117> \`ᴛꜱ::\` [Hızlı Bağlan](https://discord.gg/${serverurl})

                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

                <:zyphoradiscord:1279918880193511436> [ᴅıꜱᴄᴏʀᴅ](https://discord.gg/${serverurl}) | <:twich:1279918791001640972> [ᴛᴡıᴛᴄʜ](https://discord.gg/${serverurl}) | <:zyphorayoutube:1279919004118421688> [ʏᴏᴜᴛᴜʙᴇ](https://discord.gg/${serverurl}) | <:zyphorafivem:1279918617647120436> [ꜰıᴠᴇᴍ](https://cfx.re/join/${serverurl})
            `)
            .setImage(serverbanner)
            .setColor("#c78710");

        const members = interaction.guild.members.cache.filter(member => member.presence && member.presence.status !== 'offline');

        members.forEach(member => {
            embed.addField(member.user.tag, member.presence.activities.length > 0 ? member.presence.activities[0].name : 'Oyun oynamıyor', true);
        });

        await interaction.followUp({ content: "||@everyone|| **&** ||@here||" });

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    },
};
