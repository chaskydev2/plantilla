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
    description?: string;
    content?: string;
    banner1?: File | string;
    banner2?: File | string;
    banner3?: File | string;
}

export interface IHistoryUpdateRequest {
    title: string;
    description?: string;
    content?: string;
    banner1?: File | string;
    banner2?: File | string;
    banner3?: File | string;
    remove_banner1?: boolean;
    remove_banner2?: boolean;
    remove_banner3?: boolean;
}
