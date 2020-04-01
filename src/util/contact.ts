import { Contact, ContactTemplate, ContactUpdate, PhoneNumber, PhoneNumberLabel } from "@clinq/bridge";
import { IZammadContact } from './interfaces';

export function convertVendorContactToContact(vendorContact: IZammadContact): Contact | null {
    if (!vendorContact.id) {
        return null;
    }

    return {
        id: String(vendorContact.id),
        name: null,
        firstName: vendorContact.firstname || null,
        lastName: vendorContact.lastname || null,
        email: vendorContact.email || null,
        organization: null, // TODO vendorContact.organization_id
        contactUrl: null,
        avatarUrl: null, // TODO vendorContact.image | vendorContact.image_source
        phoneNumbers: collectPhoneNumbersFromVendorContact(vendorContact)
    };
}

function collectPhoneNumbersFromVendorContact(vendorContact: IZammadContact): PhoneNumber[] {
    const phoneNumbers: PhoneNumber[] = [];

    if (vendorContact.phone) {
        phoneNumbers.push({ label: PhoneNumberLabel.WORK, phoneNumber: vendorContact.phone });
    }
    if (vendorContact.mobile) {
        phoneNumbers.push({ label: PhoneNumberLabel.MOBILE, phoneNumber: vendorContact.mobile });
    }
    if (vendorContact.fax) {
        phoneNumbers.push({ label: "FAX" as PhoneNumberLabel, phoneNumber: vendorContact.fax });
    }

    return phoneNumbers;
}

export function convertContactToVendorContact(contact: ContactUpdate | ContactTemplate, id?: string): IZammadContact {
    const vendorContact: IZammadContact = {
        firstname: contact.firstName,
        lastname: contact.lastName
    };

    if (id) {
        vendorContact.id = Number(id);
    }

    if(contact.email) {
        vendorContact.email = contact.email;
    }

    if (Array.isArray(contact.phoneNumbers)) {
        contact.phoneNumbers.forEach((entry: PhoneNumber) => {
            if (entry.label === PhoneNumberLabel.WORK) {
                vendorContact.phone = entry.phoneNumber;
            }
            if (entry.label === PhoneNumberLabel.MOBILE) {
                vendorContact.mobile = entry.phoneNumber;
            }
            if (entry.label === "FAX" as PhoneNumberLabel) {
                vendorContact.fax = entry.phoneNumber;
            }
        });
    }

    return vendorContact;
}
