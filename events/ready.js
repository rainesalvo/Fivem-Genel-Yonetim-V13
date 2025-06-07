module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!`);

        const { status, activity } = require('../config/Guild.Config.json');

        client.user.setPresence({
            status: status,
            activities: [{
                name: activity.name,  
                type: activity.type 
            }]
        })
    },
};
