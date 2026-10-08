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
            const link = await bot.getFileLink(audio.file_id);
            const download = await fetch(link);
            if (!download.ok) {
                throw new Error(`Audio download failed: ${download.status}`);
            }
            const buffer = Buffer.from(await download.arrayBuffer());

            const form = new FormData();
            form.append('model', 'whisper-1');
            form.append('response_format', 'text');
            const mime = audio.mime_type ?? 'audio/ogg';
            form.append('file', new Blob([buffer], { type: mime }), `audio.${mime.split('/')[1] ?? 'oga'}`);

            const transcription = await fetch(`${host.replace(/\/+$/, '')}/v1/audio/transcriptions`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${key}` },
                body: form,
            });
            if (!transcription.ok) {
                throw new Error(`STT request failed: ${transcription.status}`);
            }
            const text = (await transcription.text()).trim();
            if (!text) {
                return;
            }
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
