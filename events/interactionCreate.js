const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { ticketkatagori, ticketLogChannelId, ticketyetkili, servername, serverbanner, servericon } = require('../config/Guild.Config.json');
const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'ticket_select') {
            const ticketType = values[0];
            let categoryId = ticketkatagori; 
            let channelName = `${ticketType}-${interaction.user.username}`;


            const channel = await interaction.guild.channels.create(channelName, {
                type: 'GUILD_TEXT',
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                    {
                        id: ticketyetkili,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                ],
            });

            const embed = new MessageEmbed()
            .setColor("#5100ff")
            .setTitle(`${servername} ᴅᴇsᴛᴇᴋ ᴇᴋɪʙɪ`)
            .setDescription(`ᴛɪᴄᴋᴇᴛ ᴛᴜ̈ʀᴜ̈: (${ticketType})\n\nLütfen Sabırlı Bir Şekilde Konunuzu Belirtin Ve Yetkili Arkadaşın Sizinle İliglenmesini Bekleyin.`)
            .setImage(serverbanner)
            .setThumbnail(servericon)
            .setTimestamp()

            const selectMenu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('ticket_actions')
                        .setPlaceholder('Bir işlem seçin...')
                        .addOptions([
                            {
                                label: 'ᴛɪᴄᴋᴇᴛ ᴋᴀʏᴅᴇᴛ',
                                emoji: "1279924706534887535",
                                value: 'save',
                            },
                            {
                                label: 'ᴛɪᴄᴋᴇᴛ ᴋᴀᴘᴀᴛ',
                                emoji: "1279924769185202216",
                                value: 'close',
                            },
                            {
                                label: 'ɪ̇ʟɢɪʟᴇɴᴇɴ',
                                emoji: "1279919139036860562",
                                value: 'assign',
                            },
                        ])
                );

            await channel.send({ embeds: [embed], components: [selectMenu] });

            await interaction.reply({
                content: `ᴛɪᴄᴋᴇᴛ ʙᴀşᴀʀıʏʟᴀ ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ: <#${channel.id}>`,
                ephemeral: true,
            });
        }

        if (customId === 'ticket_actions') {
            const action = values[0];
            const channel = interaction.channel;
            const logChannel = await interaction.guild.channels.fetch(ticketLogChannelId);

            if (action === 'save') {

                const savedEmbed = new MessageEmbed()
                    .setTitle('ᴛɪᴄᴋᴇᴛ ᴋᴀʏᴅᴇᴅɪʟᴅɪ')
                    .setDescription(`ᴛɪᴄᴋᴇᴛ ᴛᴜ̈ʀᴜ̈: **${channel.name}** ᴋᴀʏᴅᴇᴅɪʟᴅɪ.\nᴛɪᴄᴋᴇᴛ sᴀʜɪʙɪ: <@${interaction.user.id}>`)
                    .setColor('#00FF00')
                    .setTimestamp();

                await logChannel.send({ embeds: [savedEmbed] });
                await interaction.reply('ᴛɪᴄᴋᴇᴛ ᴋᴀʏᴅᴇᴅɪʟᴅɪ.');
            } else if (action === 'close') {
                await channel.setName(`kapatılan-${channel.name}`);

                const closeEmbed = new MessageEmbed()
                    .setTitle('ᴛɪᴄᴋᴇᴛ ᴋᴀᴘᴀᴛıʟᴅı')
                    .setDescription(`ᴛɪᴄᴋᴇᴛ ᴛᴜ̈ʀᴜ̈: **${channel.name}** ᴋᴀᴘᴀᴛıʟᴅı.\nᴛɪᴄᴋᴇᴛ sᴀʜɪʙɪ: <@${interaction.user.id}>`)
                    .setColor('#FF0000')
                    .setTimestamp();

                await logChannel.send({ embeds: [closeEmbed] });

                const messages = await channel.messages.fetch({ limit: 100 });
                let messageContent = '';

                messages.forEach((msg) => {
                    messageContent += `**${msg.author.tag}:** ${msg.content}\n`;
                });

                fs.writeFileSync(`./${channel.name}.txt`, messageContent);
                const attachment = { files: [`./${channel.name}.txt`] };

                await logChannel.send({ files: attachment.files });

                setTimeout(async () => {
                    await channel.delete();
                }, 15000);

                await interaction.reply('ᴛɪᴄᴋᴇᴛ ᴋᴀᴘᴀᴛıʟᴅı ᴠᴇ 𝟷𝟻 sᴀɴɪʏᴇ sᴏɴʀᴀ sɪʟɪɴᴇᴄᴇᴋ.');
            } else if (action === 'assign') {
                const assignedEmbed = new MessageEmbed()
                    .setTitle('ᴛɪᴄᴋᴇᴛ ɪ̇ʟɢɪʟᴇɴɪʏᴏʀ')
                    .setDescription(`ᴛɪᴄᴋᴇᴛ ᴛᴜ̈ʀᴜ̈: **${channel.name}** ɪʟᴇ ɪʟɢɪʟᴇɴᴇɴ ʏᴇᴛᴋɪʟɪ: <@${interaction.user.id}>`)
                    .setColor('#FFFF00')
                    .setTimestamp();

                await logChannel.send({ embeds: [assignedEmbed] });

                const embed = new MessageEmbed()
                    .setTitle('ᴛɪᴄᴋᴇᴛ ɪ̇ʟɢɪʟᴇɴɪʏᴏʀ!')
                    .setDescription(`ʙᴜ ᴛɪᴄᴋᴇᴛ ɪʟᴇ ɪʟɢɪʟᴇɴᴇɴ ʏᴇᴛᴋɪʟɪ: <@${interaction.user.id}>`)
                    .setColor('#FFFF00');

                await channel.send({ embeds: [embed] });

                await interaction.reply('ᴛɪᴄᴋᴇᴛ ɪʟɢɪʟᴇɴᴇɴ ᴋɪşɪʏᴇ ᴀᴛᴀɴᴍışᴛıʀ.');
            }
        }

        if (interaction.commandName === 'Onayla') {
            await interaction.reply({
                content: `${interaction.targetUser.tag} onaylandı!`,
                ephemeral: true,
            });
        } else if (interaction.commandName === 'Reddet') {
            await interaction.reply({
                content: `${interaction.targetUser.tag} reddedildi.`,
                ephemeral: true,
            });
        }
    },

};
