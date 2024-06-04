// import connection from "./knexDb/db";
import * as configuration from './knexDb/knexfile';
import knex from 'knex';
import { getContactById, getIdCreateAt, idResponse, insertContactModel, insertLinkedContactModel, singleIdResponse } from './interface';
const connection = knex(configuration);

const modelContact = async ({ email, phoneNumber, linkPrecedence = 'primary' }: insertContactModel): Promise<idResponse> => connection('contact').insert({
    email,
    phoneNumber,
    linkPrecedence,
    createdAt: 'now()',
    updatedAt: 'now()',
})
    .onConflict(['email', 'phoneNumber'])
    .ignore()
    .returning('id');

const modelContactSecondary = async ({
    email,
    phoneNumber,
    linkPrecedence = 'secondary',
    linkedId
}: insertLinkedContactModel): Promise<idResponse> => connection('contact').insert({
    email,
    phoneNumber,
    linkPrecedence,
    linkedId,
    createdAt: 'now()',
    updatedAt: 'now()',
})
    .onConflict(['email', 'phoneNumber'])
    .ignore()
    .returning('id');

const getModelContactId = async ({ email, phoneNumber }: insertContactModel): Promise<idResponse> => {
    const query = connection('contact')
        .select('id')
        .andWhere('deletedAt', null);

    if (email && phoneNumber) {
        query.where(function () {
            this.where('email', email)
                .orWhere('phoneNumber', phoneNumber);
        })
    } else if (email) {
        query.where('email', email);
    } else if (phoneNumber) {
        query.where('phoneNumber', phoneNumber);
    }

    return query;

};

const getPrimaryId = async ({ email, phoneNumber }: insertContactModel): Promise<singleIdResponse> => {
    const query = connection('contact')
        .select('id')
        .where('deletedAt', null)
        .andWhere('linkPrecedence', 'primary')
        .first();

    if (email) {
        query.andWhere('email', email);
    }
    if (phoneNumber) {
        query.andWhere('phoneNumber', phoneNumber);
    }

    return query;

};

const getLinkedSecId = async ({ email, phoneNumber }: insertContactModel): Promise<singleIdResponse> => {
    const query = connection('contact')
        .select('linkedId as id')
        .where('deletedAt', null)
        .andWhere('linkPrecedence', 'secondary')
        .first();

    if (email) {
        query.andWhere('email', email);
    }
    if (phoneNumber) {
        query.andWhere('phoneNumber', phoneNumber);
    }

    return query;

};

const getTimeData = async ({ emailLinkedId, phoneNumberId }: { emailLinkedId: number, phoneNumberId: number }): Promise<idResponse> => {
    const query = connection('contact')
        .select('id')
        .where('deletedAt', null)
        .andWhere('linkPrecedence', 'primary')
        .andWhere('id', emailLinkedId)
        .orWhere('id', phoneNumberId)
        .orderBy('createdAt');

    return query;

};

const updateSecondary = async ({ primaryId, secondaryId }: { primaryId: number, secondaryId: number }) => {
    const query = connection('contact')
        .update({
            linkPrecedence: 'secondary',
            linkedId: primaryId,
            updatedAt: 'now()'
        }).where('id', secondaryId);

    return query;
}
const updateLinkedId = async ({ primaryId, secondaryId }: { primaryId: number, secondaryId: number }) => {
    const query = connection('contact')
        .update({
            linkedId: primaryId,
            updatedAt: 'now()'
        }).where('linkedId', secondaryId);

    return query;
}

const selectDistinctEmail = async ({ linkedId, email }: { linkedId: number, email?: string }): Promise<{ email: string; }[]> => {
    const query = connection('contact')
        .distinct('email')
        .where('linkPrecedence', 'secondary')
        .andWhere('linkedId', linkedId)
        .whereNotNull('email');
    if (email) {
        query.whereNot('email', email);
    }
    return query;
}
const selectDistinctPhoneNumber = async ({ linkedId, phoneNumber }: { linkedId: number, phoneNumber?: number }): Promise<{ phoneNumber: number }[]> => {
    const query = connection('contact')
        .distinct('phoneNumber')
        .where('linkPrecedence', 'secondary')
        .andWhere('linkedId', linkedId)
        .whereNotNull('phoneNumber');
    if (phoneNumber) {
        query.whereNot('phoneNumber', phoneNumber);
    }
    return query;
}
const selectDistinctId = async ({ linkedId }: { linkedId: number }): Promise<{ id: number; }[]> => {
    const query = connection('contact')
        .distinct('id')
        .where('linkPrecedence', 'secondary')
        .andWhere('linkedId', linkedId);

    return query;
}
const selectOnId = async ({ linkedId }: { linkedId: number }): Promise<getContactById> => {
    const query = connection('contact')
        .select('id', 'email', 'phoneNumber')
        .where('id', linkedId)
        .first();

    return query;
}

export {
    modelContact,
    getModelContactId,
    getPrimaryId,
    getLinkedSecId,
    modelContactSecondary,
    getTimeData,
    updateSecondary,
    updateLinkedId,
    selectDistinctEmail,
    selectDistinctPhoneNumber,
    selectDistinctId,
    selectOnId
};