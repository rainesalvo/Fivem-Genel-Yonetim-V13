const { Client, Intents, Collection } = require('discord.js');
const { token, clientId, guildId, unregisterRolId, messageLogChannelId } = require('./config/Guild.Config.json');
const fs = require('fs');
const mongoose = require('mongoose');
const db = require('./database/database.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

db.init();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Collection();

const commandFolders = fs.readdirSync('./server');
const commands = [];

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./server/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./server/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Slash ve Sağ Tık komutları sunucuya kaydediliyor...');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Tüm komutlar başarıyla kaydedildi!');
    } catch (error) {
        console.error('Komut kaydederken bir hata oluştu: ', error);
        if (error.response) {
            console.error('Hata ayrıntıları:', error.response.body);
        }
    }
})();


client.once('ready', () => {
    console.log(`Bot giriş yaptı!`);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error('Komut çalıştırılırken hata oluştu: ', error);
            await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
        }
    }

    if (interaction.isContextMenu()) {
        if (interaction.commandName === 'İC İsim Onayla') {
            const targetUser = interaction.targetUser;
            const channel = interaction.channel;
            const messages = await channel.messages.fetch({ limit: 20 });

            const lastMessage = messages
                .filter(message => message.author.id === targetUser.id)
                .first(); 

            if (!lastMessage) {
                return interaction.reply({
                    content: 'Bu kullanıcının yazdığı bir mesaj bulunamadı!',
                    ephemeral: true,
                });
            }

            let newName = lastMessage.content;

            if (newName.length > 32) {
                newName = newName.substring(0, 32);
                console.log(`İsim çok uzun, 32 karakterle sınırlandırıldı: ${newName}`);
            }

            const member = await interaction.guild.members.fetch(targetUser.id);
            await member.setNickname(newName); 

            await channel.send(`${targetUser} IC İsim Yetkililerimiz Tarafından Onaylandı Ve İsmin "${newName}" Olarak Değiştirildi!`);
            await interaction.reply({
                content: `${targetUser} IC İsim Yetkililerimiz Tarafından Onaylandı Ve İsmin "${newName}" Olarak Değiştirildi!`,
                ephemeral: true,
            });
        } 

        else if (interaction.commandName === 'İC İsim Reddet') {
            const targetUser = interaction.targetUser;

            await interaction.reply({
                content: `${targetUser} IC İsmin Yetkililer Tarafından Reddedildi!`,
                ephemeral: true,
            });

            const channel = interaction.channel;
            await channel.send(`${targetUser} IC İsmin Yetkililer Tarafından Reddedildi!`);
        }
    }
});


client.on('messageDelete', async (message) => {
    const logChannel = message.guild.channels.cache.get(messageLogChannelId);
    
    if (!logChannel) return; 
    const embed = {
        color: 0xff0000,  
        title: "Mesaj Silindi",
        description: `**Kullanıcı:** ${message.author.tag}\n**İçerik:** ${message.content || 'İçerik bulunamadı.'}`,
        timestamp: new Date(),
        footer: {
            text: `Mesaj Silindi`,
        },
    };

    logChannel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async (member) => {
    const role = member.guild.roles.cache.get(unregisterRolId); 
    if (!role) return;

    try {
        await member.roles.add(role);
        console.log(`${member.user.tag} kullanıcısına rol verildi.`);
    } catch (error) {
        console.error('Rol verilirken hata oluştu: ', error);
    }
});

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB bağlantısı başarılı!');
}).catch(err => {
    console.error('MongoDB bağlantısı sırasında hata: ', err);
});

client.login(token);