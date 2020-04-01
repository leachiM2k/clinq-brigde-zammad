# CLINQ CRM-Bridge for Zammad

This service provides customers from Zammad for the CLINQ app.

## Prerequisites

Please create `.env` file or provide following environment variables:

- LOCAL_HTTPS_PORT - If specified, a local https proxy is created with that port (needed by Zammad for locahost redirects)
- OAUTH_IDENTIFIER - Name of CRM Bridge

## Needed Headers

- X-Provider-Key: is an access token, that can be issued per user under https://<your-instance>.zammad.com/#profile/token_access (should have admin.user rights)
- X-Provider-Url: https://<your-instance>.zammad.com

## License

[Apache 2.0](LICENSE)
