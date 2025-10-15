export interface ITag {
    id: any;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface ITagCreateRequest {
    name: string;
    slug?: string;
}

export interface ITagUpdateRequest {
    name: string;
    slug?: string;
}
