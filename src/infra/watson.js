import Assistent from 'ibm-watson/assistant/v2.js';
import { IamAuthenticator } from 'ibm-watson/auth/index.js';
import CONFIG from '../config/env.js';

export const assistant = new Assistent({
	version: '2021-11-27',
	serviceUrl: CONFIG.ASSISTANT_URL,
	disableSslVerification: true,
	authenticator: new IamAuthenticator({
		apikey: CONFIG.ASSISTANT_KEY
	})
});
