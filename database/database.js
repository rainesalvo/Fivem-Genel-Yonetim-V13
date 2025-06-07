const mongoose = require('mongoose');
const { mongoURI } = require('../config/Guild.Config.json');

module.exports = {
    init: () => {
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
        }).catch((err) => {
            console.error('MongoDB bağlantı hatası:', err);
        });
    },
};
