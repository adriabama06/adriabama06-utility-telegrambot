const { OpenAI, toFile } = require('openai');

/** @type {import('../types').BotEvent} */
module.exports = {
    name: 'stt',

    /**
     * @param {import('../types').TelegramBot} bot
     * @param {import('../types').TelegramMessage} msg
     */
    async run(bot, msg) {
        const host = process.env.STT_OPENAI_HOST;
        const key = process.env.STT_OPENAI_KEY;
        if (!host || !key) {
            return;
        }
        const model = process.env.STT_OPENAI_MODEL || 'whisper-1';

        const audio = msg.voice ?? msg.audio;
        if (!audio) {
            return;
        }
        if (audio.file_size && audio.file_size > 25 * 1024 * 1024) {
            await bot.sendMessage(msg.chat.id, '⚠️ Audio file is too large to transcribe (max 25 MB).', {
                reply_to_message_id: msg.message_id,
            });
            return;
        }

        await bot.sendChatAction(msg.chat.id, 'typing').catch(() => {});

        try {
            const client = new OpenAI({ apiKey: key, baseURL: host });

            const link = await bot.getFileLink(audio.file_id);
            const download = await fetch(link);

            if (!download.ok) throw new Error(`Audio download failed: ${download.status}`);

            const mime = audio.mime_type ?? 'audio/ogg';
            const file = await toFile(Buffer.from(await download.arrayBuffer()), `audio.${mime.split('/')[1] ?? 'oga'}`, {
                type: mime,
            });

            const result = await client.audio.transcriptions.create({
                file,
                model,
                response_format: 'text',
            });

            const text = result.replace(/\n/g, ' ').trim();

            if (!text) throw new Error("No text in audio");

            await bot.sendMessage(msg.chat.id, text, {
                reply_to_message_id: msg.message_id,
            });

        } catch (err) {
            console.error('[ERROR] Event stt:', err instanceof Error ? err.message : err);
            await bot
                .sendMessage(msg.chat.id, '⚠️ Could not transcribe the audio.', {
                    reply_to_message_id: msg.message_id,
                })
                .catch(() => {});
        }
    },
};
