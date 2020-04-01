import parseEnvironment from './parse-environment';

export default function () {
    return {
        OAUTH_CLIENT_ID: parseEnvironment().ZAMMAD_CLIENT_ID,
        OAUTH_CLIENT_SECRET: parseEnvironment().ZAMMAD_CLIENT_SECRET,
        OAUTH_REDIRECT_URL: parseEnvironment().ZAMMAD_REDIRECT_URL,
        OAUTH_AUTHORIZE_URL: 'https://michael-rotmanov.zammad.com/oauth/authorize',
        OAUTH_GRANT_ACCESS_URL: 'https://michael-rotmanov.zammad.com/oauth/token',
        VENDOR_BASE_URL: 'https://michael-rotmanov.zammad.com'
    };
};
