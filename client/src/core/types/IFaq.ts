export interface IFaq {
    id: any;
    question: string;
    answer: string;
    order: number;
}

export interface IFaqCreateRequest {
    question: string;
    answer: string;
    order: number;
}

export interface IFaqUpdateRequest {
    question: string;
    answer: string;
    order: number;
}
