const fs = require('node:fs');
const path = require('node:path');

/** @type {import('../types').BotCommand} */
module.exports = {
    name: 'help',
    description: 'Lists available commands. Usage: /help',

    /**
     * @param {import('../types').TelegramBot} bot
     * @param {import('../types').TelegramMessage} msg
     */
    async run(bot, msg) {
        const cmdsPath = path.join(__dirname);
        /** @type {string[]} */
        const lines = [];

        for (const file of fs.readdirSync(cmdsPath).filter(/** @param {string} f */ (f) => f.endsWith('.js'))) {
            /** @type {import('../types').BotCommand} */
            const cmd = require(path.join(cmdsPath, file));
            if (!cmd.name) continue;
            lines.push(`/${cmd.name} - ${cmd.description}`);
        }

        lines.sort();
        await bot.sendMessage(msg.chat.id, `📖 Available commands:\n\n${lines.join('\n')}`);
    },
};
