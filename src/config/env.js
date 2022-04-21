import { config } from 'dotenv-safe';
config();

const CONFIG = {
	CHANNEL_ID: process.env.CHANNEL_ID,
	YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
	BOT_TOKEN: process.env.BOT_TOKEN,
	PORT: process.env.PORT
};

export default CONFIG;
