import Assistent from 'ibm-watson/assistant/v2.js';
import { IamAuthenticator } from 'ibm-watson/auth/index.js';
import CONFIG from '../config/env.js';

const assistant = new Assistent({
	version: '2021-11-27',
	serviceUrl: CONFIG.ASSISTANT_URL,
	disableSslVerification: true,
	authenticator: new IamAuthenticator({
		apikey: CONFIG.ASSISTANT_KEY
	})
});

const getMessage = async (message, sessionId) => {
	const response = await assistant.message({
		workspaceId: CONFIG.ASSISTANT_WORKSPACE_ID,
		input: {
			text: message
		},
		assistantId: CONFIG.ASSISTANT_WORKSPACE_ID,
		sessionId
	});
	if (
		response &&
		response.result &&
		response.result.output &&
		Array.isArray(response.result.output.generic)
	) {
		const { text, title, suggestions } = response.result.output.generic[0];
		if (text) return text;
		if (title && Array.isArray(suggestions))
			return `${title}\n${suggestions
				.map((suggestion) =>
					Array.isArray(suggestion.output.generic) &&
					suggestion.output.generic.length >= 1
						? suggestion.output.generic[0].text
						: suggestion.output.generic.text
				)
				.filter((suggestion) => !!suggestion)
				.join('\n')}`;
	}
	return 'Desculpe, ocorreu um erro, tente novamente mais tarde';
};

export const getAssistantMessage = async (message) => {
	try {
		const session = await assistant.createSession({
			assistantId: CONFIG.ASSISTANT_WORKSPACE_ID
		});
		return getMessage(message, session.result.session_id);
	} catch (error) {
		console.log(error);
	}
	return 'Desculpe, ocorreu um erro, tente novamente mais tarde';
};
