export interface insertContact {
    email?: string;
    phoneNumber?: number;
}
export interface insertContactModel extends insertContact {
    linkPrecedence?: 'primary' | 'secondary';
}
export interface insertLinkedContactModel extends insertContactModel {
    linkedId: number;
}

export interface getContactById {
    id: number;
    email: string;
    phoneNumber: number;
}
export interface getIdCreateAt {
    id: number;
    createdAt: Date;
}

export type idResponse = { id: number }[];

export type singleIdResponse = { id: number } | undefined;