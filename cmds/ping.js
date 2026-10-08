/** @type {import('../types').BotCommand} */
module.exports = {
    name: 'ping',
    description: 'Checks bot latency. Usage: /ping',

    /**
     * @param {import('../types').TelegramBot} bot
     * @param {import('../types').TelegramMessage} msg
     * @param {string[]} args
     */
    async run(bot, msg, args) {
        const start = Date.now();
        const sent = await bot.sendMessage(msg.chat.id, '🏓 Pong...');
        const latency = Date.now() - start;
        await bot.editMessageText(`🏓 Pong! (${latency} ms)`, {
            chat_id: sent.chat.id,
            message_id: sent.message_id,
        });
    },
};
