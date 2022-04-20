import { Telegraf } from 'telegraf';

import CONFIG from './config/env.js';
import VideoService from './service/videoService.js';
import YoutubeService from './service/youtubeService.js';

const bot = new Telegraf(CONFIG.BOT_TOKEN, {
	telegram: {
		webhookReply: true
	}
});

const help = `/listAll - Lista todos os videos
/list - Lista os que você fez a segestão
/listPending - Lista os videos que ainda estão pendentes


para fazer uma segestão de video basta enviar Tema: <tema>
exemplo: Tema: sistemas distribuidos
`;

const videoService = new VideoService();

bot.start((ctx) => ctx.reply(`${help}`));
bot.help((ctx) => ctx.reply(help));

bot.command('listAll', async (ctx) => {
	ctx.reply(await videoService.listAll());
});
bot.command('list', async (ctx) => {
	ctx.reply(await videoService.list({ chatId: ctx.chat.id }));
});
bot.command('listPending', async (ctx) => {
	ctx.reply(await videoService.listPending({ chatId: ctx.chat.id }));
});

bot.on('message', async (ctx) => {
	const message = ctx.message.text?.toLowerCase();
	if (message.startsWith('tema:')) {
		const response = await videoService.create({
			theme: message,
			chatId: ctx.chat.id,
			messageId: ctx.message.message_id
		});
		return ctx.reply(response, {
			reply_to_message_id: ctx.message.message_id
		});
	}
	return ctx.reply('Hello World22222!');
});
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
