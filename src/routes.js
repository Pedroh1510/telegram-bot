import { Router } from 'express';
import VideoService from './service/videoService.js';

const router = Router();
const videoService = new VideoService();

router.get('/listAll', async (req, res) =>
	res.send(await videoService.listAll())
);
