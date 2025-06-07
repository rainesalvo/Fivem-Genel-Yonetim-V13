const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '.' },
});

module.exports = mongoose.model('Guild', GuildSchema);
