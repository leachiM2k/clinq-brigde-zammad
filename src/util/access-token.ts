import axios from 'axios';
import config from './config';
import { IZammadAuthResponse, RequestMethods } from './interfaces';

export async function authorizeApiKey(apiKey: string): Promise<{ accessToken: string, refreshToken: string }> {
    if (typeof apiKey !== "string" || !apiKey || apiKey.trim().length === 0) {
        throw new Error("Invalid API key.");
    }
    const [, refreshToken] = apiKey.split(":");

    if (!refreshToken) {
        throw new Error('Could not extract refresh token from api key');
    }

    const { access_token, refresh_token } = await getNewAccessToken(refreshToken);
    // TODO: maybe it is worth to cache the access token? (with the refresher token as key)
    return { accessToken: access_token, refreshToken: refresh_token };
}

async function getNewAccessToken(refreshToken: string): Promise<IZammadAuthResponse> {
    const reqOptions = {
        url: config().OAUTH_GRANT_ACCESS_URL,
        method: RequestMethods.POST,
        body: {
            refresh_token: refreshToken,
            client_id: config().OAUTH_CLIENT_ID,
            client_secret: config().OAUTH_CLIENT_SECRET,
            grant_type: 'refresh_token'
        }
    };
    const response = await axios.post(reqOptions.url, reqOptions.body);
    return response.data as Promise<IZammadAuthResponse>;
}

export async function getTokens(code: string): Promise<IZammadAuthResponse> {
    const data = {
        code,
        redirect_uri: config().OAUTH_REDIRECT_URL,
        client_id: config().OAUTH_CLIENT_ID,
        client_secret: config().OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code'
    };
    const response = await axios.post(config().OAUTH_GRANT_ACCESS_URL, data);
    return response.data;
}
