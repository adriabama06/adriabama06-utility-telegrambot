/**
 * @typedef {import('node-telegram-bot-api')} TelegramBot
 * @typedef {import('node-telegram-bot-api').Message} TelegramMessage
 * @typedef {import('node-telegram-bot-api').Chat} TelegramChat
 * @typedef {import('node-telegram-bot-api').User} TelegramUser
 */

/**
 * @callback CommandRun
 * @param {TelegramBot} bot
 * @param {TelegramMessage} msg
 * @param {string[]} args
 * @returns {Promise<void>}
 */

/**
 * @typedef {object} BotCommand
 * @property {string} name
 * @property {string} [description]
 * @property {CommandRun} run
 */

/**
 * @callback EventRun
 * @param {TelegramBot} bot
 * @param {TelegramMessage} msg
 * @returns {Promise<void>}
 */

/**
 * @typedef {object} BotEvent
 * @property {string} name
 * @property {EventRun} run
 */

module.exports = {};
