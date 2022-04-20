import { config } from 'dotenv-safe'
import Tbot from 'node-telegram-bot-api';
config()

const telegramBot = new Tbot(process.env.BOT_TOKEN, { polling: true });

telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  telegramBot.sendMessage(chatId, 'Hello world!');
})
