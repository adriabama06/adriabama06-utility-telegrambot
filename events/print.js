/** @type {import('../types').BotEvent} */
module.exports = {
    name: 'print',

    /**
     * @param {import('../types').TelegramBot} bot
     * @param {import('../types').TelegramMessage} msg
     */
    async run(bot, msg) {
        const user = msg.from
            ? `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim() +
                ` (@${msg.from.username || 'no-username'}, id:${msg.from.id})`
            : 'unknown';
        const chat =
            msg.chat.type === 'private'
                ? `private (id:${msg.chat.id})`
                : `${msg.chat.title || 'untitled'} [${msg.chat.type}, id:${msg.chat.id}]`;

        const content = msg.text
            ? `text: ${msg.text}`
            : msg.photo
                ? `[photo with ${msg.photo.length} sizes, caption: ${msg.caption || '-'}]`
                : msg.sticker
                    ? `[sticker: ${msg.sticker.emoji || '?'} ${msg.sticker.set_name || ''}]`
                    : msg.animation
                        ? `[gif/animation, caption: ${msg.caption || '-'}]`
                        : msg.voice
                            ? `[voice note: ${msg.voice.duration}s]`
                            : msg.video
                                ? `[video, caption: ${msg.caption || '-'}]`
                                : msg.document
                                    ? `[document: ${msg.document.file_name || 'unnamed'}]`
                                    : msg.location
                                        ? `[location: ${msg.location.latitude},${msg.location.longitude}]`
                                        : `[type: ${Object.keys(msg).filter((k) => !['message_id', 'from', 'chat', 'date', 'text'].includes(k)).join(', ') || 'unknown'}]`;

        console.log(`[MSG] ${new Date(msg.date * 1000).toISOString()} | from: ${user} | in: ${chat} | ${content}`);
    },
};
