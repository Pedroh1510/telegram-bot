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
			const videos = await prisma.chat.findMany({
				where: {
					idTelegramChat: String(chatId)
				},
				include: {
					video: true
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
					idTelegramChat: String(chatId),
					status: 'Pendente'
				}
			});
			let message = '';
			for (const video of videos) {
				message += `${video.sugestao} => Pendente\n`;
			}
			return message || 'Não há videos cadastrados';
		} catch (error) {
			return 'Erro ao listar videos';
		}
	}

	videosToMessage(videos) {
		let message = '';
		for (const video of videos)
			if (video?.sugestao) {
				if (video?.video) {
					message += `${video.video.titulo} => ${video.video.url}\n`;
				} else {
					message += `${video.sugestao} => pendente\n`;
				}
			} else {
				message += `${video.titulo} => ${video.url}\n`;
			}
		return message || 'Não há videos cadastrados';
	}

	async create({ theme, chatId, messageId }) {
		try {
			const hasVideo = await prisma.chat.findMany({
				where: {
					sugestao: theme?.trim()
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
			return `Tema '${video.sugestao.trim()}' cadastrado com sucesso`;
		} catch (error) {
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
			return 'Erro ao criar video';
		}
	}

	async getChatByVideo(videoId) {
		try {
			const chat = await prisma.chat.findFirst({
				where: {
					video: {
						id: videoId
					}
				}
			});
			return chat;
		} catch (error) {
			return 'Erro ao buscar chat';
		}
	}
}
