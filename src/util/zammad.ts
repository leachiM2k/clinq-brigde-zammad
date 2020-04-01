import { Contact, ContactTemplate, ContactUpdate } from '@clinq/bridge';
import axios from 'axios';
import querystring from 'querystring';
import { authorizeApiKey } from './access-token';
import config from './config';
import { convertContactToVendorContact, convertVendorContactToContact } from './contact';
import {
    IZammadAuthResponse,
} from './interfaces';

export async function createContact(
    apiKey: string,
    contact: ContactTemplate
): Promise<Contact> {
    const vendorContact = convertContactToVendorContact(contact);

    const { accessToken } = await authorizeApiKey(apiKey);
    const response = await axios.post(`${config().VENDOR_BASE_URL}/api/v1/users`, vendorContact, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (!response || response.status !== 201) {
        return Promise.reject(`Error in Zammad response: ${response.statusText}`);
    }

    if (!response || !response.data || !response.data.id) {
        throw new Error(`Could not create Zammad contact.`);
    }

    const receivedContact = convertVendorContactToContact(response.data);
    if (!receivedContact) {
        throw new Error("Could not parse received contact");
    }
    return receivedContact;
}

export async function updateContact(
    apiKey: string,
    contact: ContactUpdate
): Promise<Contact> {
    if (!contact.id) {
        throw new Error(`Contact id is missing in request`);
    }
    const vendorContact = convertContactToVendorContact(contact, contact.id);

    const { accessToken } = await authorizeApiKey(apiKey);
    const response = await axios.put(`${config().VENDOR_BASE_URL}/api/v1/users/${contact.id}`, vendorContact, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (!response || response.status !== 200) {
        return Promise.reject(`Error in Zammad response: ${response.statusText}`);
    }

    if (!response.data) {
        throw new Error(`Could not update Zammad contact.`);
    }

    const receivedContact = convertVendorContactToContact(response.data);
    if (!receivedContact) {
        throw new Error("Could not parse received contact");
    }
    return receivedContact;
}

export async function getContacts(
    apiKey: string
): Promise<Contact[]> {
    const { accessToken } = await authorizeApiKey(apiKey);
    return getPaginatedContacts(accessToken);
}

async function getPaginatedContacts(
    accessToken: string,
    page: number = 1,
    previousContacts?: Contact[]
): Promise<Contact[]> {
    // search for "customers" only
    const response = await axios.get(`${config().VENDOR_BASE_URL}/api/v1/users/search?query=role_ids:3`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page }
    });

    if (!response || response.status !== 200) {
        return Promise.reject(`Error in Zammad response: ${response.statusText}`);
    }

    if (!response || !Array.isArray(response.data) || response.data.length === 0) {
        return previousContacts || [];
    }

    const contacts: Contact[] = previousContacts || [];

    for (const vendorContact of response.data) {
        const contact = convertVendorContactToContact(vendorContact);

        if (contact && contact.phoneNumbers.length > 0) {
            contacts.push(contact);
        }
    }

    if (response.data.length > 0) {
        return getPaginatedContacts(accessToken, page + 1, contacts);
    }

    return contacts;
}

export async function deleteContact(apiKey: string, id: string): Promise<void> {
    const { accessToken } = await authorizeApiKey(apiKey);
    const responseGet = await axios.get(`${config().VENDOR_BASE_URL}/api/v1/users/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (!responseGet || responseGet.status !== 200) {
        return Promise.reject(`Error in Zammad response: ${responseGet.statusText}`);
    }

    if (!responseGet || !responseGet.data || !responseGet.data.role_ids.includes(3)) {
        throw new Error(`Could not delete Zammad contact: user id has not a customer role`);
    }

    const response = await axios.delete(`${config().VENDOR_BASE_URL}/api/v1/users/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (!response || response.status !== 200) {
        return Promise.reject(`Error in Zammad response: ${response.statusText}`);
    }
}

export function getOAuth2RedirectUrl(): string {
    return config().OAUTH_AUTHORIZE_URL + '?' + querystring.encode({
            client_id: config().OAUTH_CLIENT_ID,
            response_type: 'code',
            redirect_uri: config().OAUTH_REDIRECT_URL,
        }
    );
}
