# CLINQ CRM-Bridge for Zammad

This service provides customers from Zammad for the CLINQ app.

## Prerequisites

Please create `.env` file or provide following environment variables:

- LOCAL_HTTPS_PORT - If specified, a local https proxy is created with that port (needed by Zammad for locahost redirects)
- OAUTH_IDENTIFIER - Name of CRM Bridge
- ZAMMAD_CLIENT_ID - Client ID of registered Zammad App at https://<your-instance>.zammad.com/#system/api
- ZAMMAD_CLIENT_SECRET - Client Secret of registered Zammad App, provided by Zammad
- ZAMMAD_REDIRECT_URL - URL of current bridge, must match with registered data at Zammad

## License

[Apache 2.0](LICENSE)
