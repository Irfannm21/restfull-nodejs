import {validate} from "../validation/validation.js";
import {
    createContactValidation,
    getContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import { request } from "express";


const create = async (user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contact = await prismaClient.contact.findFirst({
        where : {
            username : user.username,
            id: contactId,
        },
        select : {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        },

    });

    if(!contact) {
        throw new ResponseError(404, " Contact not found")
    }

    return contact;
}

const update = async (user, request) => {
    const contact = validate(updateContactValidation, request);

    const totalContactId = await prismaClient.contact.count({
        where : {
            username : user.username,
            contact : contact.id
        }
    });
    
    if(totalContactId !== 1) {
        throw new ResponseError(404, 'Contact Not Found')
    }

    return prismaClient.contact.update({
        where : {
            id : contact.id
        },
        data : {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.last_name,
            phone: contact.phone
        },
        select : {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })
}

export default {
    create,
    get,
    update,
}