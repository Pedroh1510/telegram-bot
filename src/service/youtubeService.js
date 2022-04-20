import { google } from 'googleapis';
import CONFIG from '../config/env.js';

export default class YoutubeService {
	constructor() {
		this.youtube = google.youtube({
			version: 'v3',
			auth: CONFIG.YOUTUBE_API_KEY
		});
	}

	async listAllVideos() {
		try {
			const response = await this.youtube.search.list({
				maxResults: 1000,
				channelId: CONFIG.CHANNEL_ID,
				part: 'snippet,id'
			});
			const videos = response.data.items;
			if (!videos) return 'Nenhum video encontrado';
			return videos
				.filter(({ id }) => id.kind === 'youtube#video')
				.map(({ id, snippet }) => ({
					url: `https://www.youtube.com/watch?v=${id.videoId}`,
					title: snippet.title
				}));
		} catch (error) {
			console.log(error);
			return 'Erro ao listar videos';
		}
	}
}
