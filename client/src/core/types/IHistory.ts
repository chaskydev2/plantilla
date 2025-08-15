export interface IHistory {
    id: any;
    title: string;
    description: string;
    content: string;
    banner1: string;
    banner2: string;
    banner3: string;
}

export interface IHistoryCreateRequest {
    title: string;
    description: string;
    content: string;
    banner1: string;
    banner2: string;
    banner3: string;
}

export interface IHistoryUpdateRequest {
    title: string;
    description: string;
    content: string;
    banner1: string;
    banner2: string;
    banner3: string;
}
