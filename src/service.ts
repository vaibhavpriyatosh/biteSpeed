import { getIdCreateAt, idResponse, insertContact, singleIdResponse } from './interface';
import { getLinkedSecId, getModelContactId, getPrimaryId, getTimeData, modelContact, modelContactSecondary, selectDistinctEmail, selectDistinctId, selectDistinctPhoneNumber, selectOnId, updateLinkedId, updateSecondary } from './model';

const activityService = async ({ email, phoneNumber }: insertContact) => {
    try {

        let finalId = null;
        const emailResult = await getLinkedId({ email, phoneNumber: undefined });

        const phoneNumberResult = await getLinkedId({ email: undefined, phoneNumber });

        if (!emailResult?.ok || !phoneNumberResult?.ok) {
            throw new Error('Error in Getting LinkedId');
        }

        const emailLinkedId = emailResult?.data;
        const phoneNumberId = phoneNumberResult?.data;

        if (!emailLinkedId && !phoneNumberId) {
            const result = await modelContact({ email, phoneNumber, linkPrecedence: 'primary' });
            if (result?.length === 0) {
                throw new Error('N0t able to create primary entry');
            }
            finalId = result[0]?.id
        } else if (!(emailLinkedId && phoneNumberId)) {
            const linkedId = emailLinkedId || phoneNumberId;
            if (!linkedId) {
                throw new Error('No link found!');
            }
            const result = await modelContactSecondary({
                email,
                phoneNumber,
                linkPrecedence: 'secondary',
                linkedId
            });
            if (result?.length === 0) {
                throw new Error('N0t able to create primary entry');
            }
            finalId = linkedId;
        } else if (emailLinkedId != phoneNumberId) {
            const linkedId = await updateActivityId({ emailLinkedId, phoneNumberId });
            finalId = linkedId;
        }
        else {
            finalId = emailLinkedId;
        }
        if (!finalId) {
            throw new Error('No PrimaryContactId');
        }
        //Take this list and take put all the linkedId
        //and then do your unique calculation
        const getByIdRes = await selectOnId({ linkedId: finalId });

        const [emailIds, phoneNumberIds, ids] = await Promise.all([
            selectDistinctEmail({ linkedId: finalId, email: getByIdRes?.email }),
            selectDistinctPhoneNumber({ linkedId: finalId, phoneNumber: getByIdRes?.phoneNumber }),
            selectDistinctId({ linkedId: finalId })
        ]);
        const data = {
            primaryContatctId: finalId,
            emails: [getByIdRes?.email ?? '', ...(emailIds?.filter(({ email }) => email)?.map(({ email }) => email) ?? [])],
            phoneNumbers: [getByIdRes?.phoneNumber ?? 0, ...(phoneNumberIds?.filter(({ phoneNumber }) => phoneNumber)?.map(({ phoneNumber }) => phoneNumber) ?? [])],
            secondaryContactIds: ids?.filter(({ id }) => id)?.map(({ id }) => id),
        }

        return { ok: true, data };
    } catch (e) {
        console.error(`create-model:${e}`);
        return { ok: false, err: e };
    }
};

const checkActivityService = async ({ email, phoneNumber }: insertContact) => {
    try {
        const result: idResponse = await getModelContactId({ email, phoneNumber });
        const resultEmail: idResponse = await getModelContactId({ email });
        const resultPhoneNumber: idResponse = await getModelContactId({
            phoneNumber,
        });

        const totalIdList = result.map(({ id }) => id);
        const emailIdList = resultEmail.map(({ id }) => id);
        const phoneNumberIdList = resultPhoneNumber.map(({ id }) => id);

        return { ok: true, data: { totalIdList, emailIdList, phoneNumberIdList } };
    } catch (e) {
        console.error(`create-model:${e}`);
        return { ok: false, err: e };
    }
};

const updateActivityId = async ({ emailLinkedId, phoneNumberId }: { emailLinkedId: number, phoneNumberId: number }) => {
    const result: idResponse = await getTimeData({ emailLinkedId, phoneNumberId });
    if (!result) {
        throw new Error('Id list not found');
    }
    const primaryList = result.map(({ id }) => id);

    if (primaryList?.length === 1) {
        throw new Error('Single Id found');
    }
    const primaryId = primaryList[0];
    const secondaryId = primaryList[1];
    if (primaryId === secondaryId) {
        throw new Error('Duplicate Id found');
    }
    const finalResult: PromiseSettledResult<number>[] = await Promise.allSettled([
        updateSecondary({ primaryId, secondaryId }),
        updateLinkedId({ primaryId, secondaryId })
    ]);

    const finalStatus = finalResult?.filter(({ status }) => status === 'rejected');

    if (!finalStatus || finalStatus.length !== 0) {
        throw new Error('Status Rejected');
    }

    return primaryId;
}

const getLinkedId: any = async ({ email, phoneNumber }: insertContact) => {
    try {

        let linkedId = null;

        const result: singleIdResponse = await getPrimaryId({ email, phoneNumber });

        if (result) {
            linkedId = result.id;
        } else {
            const resultLinkedId: singleIdResponse = await getLinkedSecId({ email, phoneNumber });

            if (resultLinkedId) {
                linkedId = resultLinkedId.id;
            }
        }

        return { ok: true, data: linkedId };
    } catch (e) {
        console.error(`create-model:${e}`);
        return { ok: false, err: e };
    }
};

export { activityService };
