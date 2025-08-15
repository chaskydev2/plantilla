export interface INewsletter {
    id: any;
    name: string;
    email: string;
    subject: string;
    content: string;
}

export interface INewsletterCreateRequest {
    name: string;
    email: string;
    subject: string;
    content: string;
}

export interface INewsletterUpdateRequest {
    name: string;
    email: string;
    subject:string;
    content: string;
}
