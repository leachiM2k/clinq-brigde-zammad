import {
    Adapter,
    Config,
    Contact,
    ContactTemplate,
    ContactUpdate,
    ServerError,
    start
} from "@clinq/bridge";
import dotenv from "dotenv";
import { startHttpsProxy } from './https-proxy';
import { anonymizeKey } from './util/anonymize-key';
import {
    createContact,
    deleteContact,
    getContacts,
    updateContact
} from "./util/zammad";

dotenv.config();

class ZammadAdapter implements Adapter {
    /**
     * validates required config parameters and throws errors
     * @param {Config} config
     * @throws
     */
    private static validateAndReturnRequiredConfigKeys(config: Config): { apiKey: string, apiUrl: string} {
        const apiKey = config.apiKey;
        if (!apiKey) {
            throw new ServerError(400, 'No server key provided');
        }

        const apiUrl = config.apiUrl;
        if (!apiUrl) {
            throw new ServerError(400, 'No server url provided');
        }
        return { apiKey, apiUrl };
    }

    public async getContacts(config: Config): Promise<Contact[]> {
        const { apiKey, apiUrl } = ZammadAdapter.validateAndReturnRequiredConfigKeys(config);
        try {
            return await getContacts(apiKey, apiUrl);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(`Could not get contacts for key "${anonymizeKey(apiKey)}"`, error.message);
            throw new ServerError(401, "Unauthorized");
        }
    }

    public async createContact(config: Config, contact: ContactTemplate): Promise<Contact> {
        const { apiKey, apiUrl } = ZammadAdapter.validateAndReturnRequiredConfigKeys(config);
        try {
            return createContact(apiKey, apiUrl, contact);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(`Could not create contact for key "${anonymizeKey(apiKey)}: ${error.message}"`);
            throw new ServerError(500, "Could not create contact");
        }
    }

    public async updateContact(config: Config, id: string, contact: ContactUpdate): Promise<Contact> {
        const { apiKey, apiUrl } = ZammadAdapter.validateAndReturnRequiredConfigKeys(config);
        try {
            return updateContact(apiKey, apiUrl, contact);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(`Could not update contact for key "${anonymizeKey(apiKey)}: ${error.message}"`);
            throw new ServerError(500, "Could not update contact");
        }
    }

    public async deleteContact(config: Config, id: string): Promise<void> {
        const { apiKey, apiUrl } = ZammadAdapter.validateAndReturnRequiredConfigKeys(config);
        try {
            return deleteContact(apiKey, apiUrl, id);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error(`Could not update contact for key "${anonymizeKey(apiKey)}: ${error.message}"`);
            throw new ServerError(500, "Could not update contact");
        }
    }
}

start(new ZammadAdapter());

if (process.env.LOCAL_HTTPS_PORT) {
    const settingsPort = Number(process.env.PORT) || 8080;
    startHttpsProxy(Number(process.env.LOCAL_HTTPS_PORT), settingsPort);
}
