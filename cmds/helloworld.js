/** @type {import('../types').BotCommand} */
module.exports = {
    name: 'helloworld',
    description: 'Replies with Hello World. Usage: /helloworld [optional text]',

    /**
     * @param {import('../types').TelegramBot} bot
     * @param {import('../types').TelegramMessage} msg
     * @param {string[]} args
     */
    async run(bot, msg, args) {
        const extra = args.length > 0 ? ` Received args: ${args.join(' ')}` : '';
        await bot.sendMessage(msg.chat.id, `Hello World! 👋${extra}`, {
            reply_to_message_id: msg.message_id,
        });
    },
};
