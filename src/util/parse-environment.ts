export interface IOAuth2Options {
	ZAMMAD_CLIENT_ID: string;
	ZAMMAD_CLIENT_SECRET: string;
	ZAMMAD_REDIRECT_URL: string;
}

export default function parseEnvironment(): IOAuth2Options {
	const { ZAMMAD_CLIENT_ID, ZAMMAD_CLIENT_SECRET, ZAMMAD_REDIRECT_URL } = process.env;

	if (!ZAMMAD_CLIENT_ID) {
		throw new Error("Missing client ID in environment.");
	}

	if (!ZAMMAD_CLIENT_SECRET) {
		throw new Error("Missing client secret in environment.");
	}

	if (!ZAMMAD_REDIRECT_URL) {
		throw new Error("Missing redirect url in environment.");
	}

	return {
		ZAMMAD_CLIENT_ID,
		ZAMMAD_CLIENT_SECRET,
		ZAMMAD_REDIRECT_URL
	};
}
