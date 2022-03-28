const TelegramBot = require("node-telegram-bot-api");
const { config } = require("../config.js");
const bf = require("../bot_function");
const bot = new TelegramBot(config.telegram_bot_token);
await bot.sendMessage(config.telegram_chat_id, "Received your message");

await bf.send_log("messag asdjasd");
