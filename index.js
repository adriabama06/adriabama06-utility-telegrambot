require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

if (!token) {
    console.error('[ERROR] Missing TELEGRAM_TOKEN in .env file');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

/** @type {Map<string, import('./types').BotCommand>} */
const cmds = new Map();
const cmdsPath = path.join(__dirname, 'cmds');

for (const file of fs.readdirSync(cmdsPath).filter(/** @param {string} f */ (f) => f.endsWith('.js'))) {
    const cmd = require(path.join(cmdsPath, file));
    if (!cmd.name || typeof cmd.run !== 'function') {
        console.warn(`[WARN] cmds/${file} does not export { name, run() }, skipped.`);
        continue;
    }
    cmds.set(cmd.name, cmd);
    console.log(`[CMD] /${cmd.name} loaded (${file})`);
}

/** @type {import('./types').BotEvent[]} */
const events = [];
const eventsPath = path.join(__dirname, 'events');

if (fs.existsSync(eventsPath)) {
    for (const file of fs.readdirSync(eventsPath).filter(/** @param {string} f */ (f) => f.endsWith('.js'))) {
        const evt = require(path.join(eventsPath, file));
        if (!evt.name || typeof evt.run !== 'function') {
            console.warn(`[WARN] events/${file} does not export { name, run() }, skipped.`);
            continue;
        }
        events.push(evt);
        console.log(`[EVENT] ${evt.name} loaded (${file})`);
    }
}

bot.on('message', async (/** @type {import('./types').TelegramMessage} */ msg) => {
    for (const evt of events) {
        try {
            await evt.run(bot, msg);
        } catch (err) {
            console.error(`[ERROR] Event ${evt.name}:`, err instanceof Error ? err.message : err);
        }
    }

    const text = (msg.text || '').trim();
    if (!text.startsWith('/')) return;

    const match = text.match(/^\/(\w+)(?:@\w+)?\s*(.*)$/s);
    if (!match) return;

    const cmdName = match[1].toLowerCase();
    const args = match[2] ? match[2].trim().split(/\s+/) : [];
    if (args.length === 1 && args[0] === '') args.pop();

    const cmd = cmds.get(cmdName);
    if (!cmd) return;

    try {
        await cmd.run(bot, msg, args);
    } catch (err) {
        console.error(`[ERROR] Command /${cmdName}:`, err);
        await bot.sendMessage(msg.chat.id, '⚠️ Error executing the command.').catch(() => {});
    }
});

bot.on('polling_error', (/** @type {any} */ err) => {
    console.error('[ERROR] polling:', err?.message ?? err);
});

console.log('🤖 Bot started, waiting for messages... (Ctrl+C to stop)');
