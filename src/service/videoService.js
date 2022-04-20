import prismaLib from '@prisma/client';
const { PrismaClient } = prismaLib;
const prisma = new PrismaClient();

export default class VideoService {
	async listAll() {
		try {
			const videos = await prisma.video.findMany();
			return this.videosToMessage(videos);
		} catch (error) {
			return 'Erro ao listar videos';
		}
	}
	async list({ chatId }) {
		try {
			const videos = await prisma.video.findMany({
				where: {
					idChat: String(chatId)
				}
			});

			return this.videosToMessage(videos);
		} catch (error) {
			console.log(error);
			return 'Erro ao listar videos';
		}
	}

	async listPending({ chatId }) {
		try {
			const videos = await prisma.chat.findMany({
				where: {
					idTelegram: String(chatId),
					status: 'Pendente'
				}
			});
			return this.videosToMessage(videos);
		} catch (error) {
			return 'Erro ao listar videos';
		}
	}

	videosToMessage(videos) {
		let message = '';
		for (const video of videos) {
			message += `${video.titulo} => ${video.url}\n`;
		}
		return message || 'Não há videos cadastrados';
	}

	async create({ theme, chatId, messageId }) {
		try {
			const hasVideo = await prisma.chat.findMany({
				where: {
					sugestao: theme
				}
			});
			if (Array.isArray(hasVideo) && hasVideo.length > 0)
				return 'Tema já cadastrado';
			const video = await prisma.chat.create({
				data: {
					sugestao: theme,
					idTelegramChat: String(chatId),
					idTelegramMessage: String(messageId)
				}
			});
			return `Tema '${video.sugestao}' cadastrado com sucesso`;
		} catch (error) {
			console.log(error);
			return 'Erro ao criar video';
		}
	}

	async resgisterVideos(videos) {
		try {
			const videosToRegister = videos.map((video) => ({
				url: video.url,
				titulo: video.title
			}));
			const videosCreated = await prisma.video.createMany({
				data: videosToRegister
			});
			console.log(videosCreated);
			return videosCreated;
		} catch (error) {
			console.log(error);
			return 'Erro ao criar video';
		}
	}
}
