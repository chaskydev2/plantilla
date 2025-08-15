export interface IAgreement {
    id: any;
    name: string;
    description: string;
    photo: string;
}

export interface IAgreementCreateRequest {
    name: string;
    description: string;
    photo: string;
}

export interface IAgreementUpdateRequest {
    name: string;
    description: string;
    photo: string;
}
