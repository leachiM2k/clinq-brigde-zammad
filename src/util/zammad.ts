import { Contact, ContactTemplate, ContactUpdate } from "@clinq/bridge";
import axios from "axios";
import {
  convertContactToVendorContact,
  convertVendorContactToContact
} from "./contact";

export async function createContact(
  apiKey: string,
  apiUrl: string,
  contact: ContactTemplate
): Promise<Contact> {
  const vendorContact = convertContactToVendorContact(contact);

  const response = await axios.post(`${apiUrl}/api/v1/users`, vendorContact, {
    headers: { Authorization: `Token ${apiKey}` }
  });

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
  apiUrl: string,
  contact: ContactUpdate
): Promise<Contact> {
  if (!contact.id) {
    throw new Error(`Contact id is missing in request`);
  }
  const vendorContact = convertContactToVendorContact(contact, contact.id);

  const response = await axios.put(
    `${apiUrl}/api/v1/users/${contact.id}`,
    vendorContact,
    { headers: { Authorization: `Token ${apiKey}` } }
  );

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
  apiKey: string,
  apiUrl: string
): Promise<Contact[]> {
  return getPaginatedContacts(apiKey, apiUrl);
}

async function getPaginatedContacts(
  apiKey: string,
  apiUrl: string,
  page: number = 1,
  previousContacts?: Contact[]
): Promise<Contact[]> {
  // search for "customers" only
  const response = await axios.get(
    `${apiUrl}/api/v1/users/search?query=role_ids:3`,
    {
      headers: { Authorization: `Token ${apiKey}` },
      params: { page }
    }
  );

  if (!response || response.status !== 200) {
    return Promise.reject(`Error in Zammad response: ${response.statusText}`);
  }

  if (
    !response ||
    !Array.isArray(response.data) ||
    response.data.length === 0
  ) {
    return previousContacts || [];
  }

  const contacts: Contact[] = previousContacts || [];

  for (const vendorContact of response.data) {
    const contact = convertVendorContactToContact(vendorContact);

    if (contact) {
      contacts.push(contact);
    }
  }

  if (response.data.length > 0) {
    return getPaginatedContacts(apiKey, apiUrl, page + 1, contacts);
  }

  return contacts;
}

export async function deleteContact(
  apiKey: string,
  apiUrl: string,
  id: string
): Promise<void> {
  const responseGet = await axios.get(`${apiUrl}/api/v1/users/${id}`, {
    headers: { Authorization: `Token ${apiKey}` }
  });

  if (!responseGet || responseGet.status !== 200) {
    return Promise.reject(
      `Error in Zammad response: ${responseGet.statusText}`
    );
  }

  if (
    !responseGet ||
    !responseGet.data ||
    !responseGet.data.role_ids.includes(3)
  ) {
    throw new Error(
      `Could not delete Zammad contact: user id has not a customer role`
    );
  }

  const response = await axios.delete(`${apiUrl}/api/v1/users/${id}`, {
    headers: { Authorization: `Token ${apiKey}` }
  });

  if (!response || response.status !== 200) {
    return Promise.reject(`Error in Zammad response: ${response.statusText}`);
  }
}
