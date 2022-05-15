import { Telegraf } from 'telegraf';

import CONFIG from './config/env.js';
import VideoService from './service/videoService.js';

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
const youtubeService = new YoutubeService();

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
	if (message?.startsWith('tema:')) {
		const response = await videoService.create({
			theme: message.replace('tema:', ''),
			chatId: ctx.chat.id,
			messageId: ctx.message.message_id
		});
		return ctx.reply(response, {
			reply_to_message_id: ctx.message.message_id
		});
	}
	const assistantMessage = await getAssistantMessage(message);
	ctx.reply(assistantMessage);
});
bot.launch();

import express from 'express';
import asyncError from 'express-async-handler';
import YoutubeService from './service/youtubeService.js';
import { getAssistantMessage } from './infra/watson.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/readyVideo', async (req, res) => {
	const { videoId } = req.body;
	try {
		const response = await videoService.getChatByVideo(videoId);
		await bot.telegram.sendMessage(
			response.idTelegramChat,
			`${response.sugestao} => ${response.status}`,
			{
				reply_to_message_id: response.idTelegramMessage
			}
		);
		res.send('ok');
	} catch (error) {
		console.log(error);
		res.send('error');
	}
});
app.post('/getAllVideos', async (req, res) => {
	try {
		const response = await youtubeService.listAllVideos();
		res.send(await videoService.resgisterVideos(response));
	} catch (error) {
		console.log(error);
		res.send('error');
	}
});

app.use((err, req, res, next) => {
	if (err) {
		console.log(err);
		return res.status(500).send('Internal Server Error');
	}
	next();
});

app.listen(CONFIG.PORT, () => console.log(`Listening on port ${CONFIG.PORT}`));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
