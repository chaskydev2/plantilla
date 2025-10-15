export interface IRequirement {
    id: any;
    title: string;
    description: string;
    type: string;
    order: number;
    created_at?: string;
    updated_at?: string;
}

export interface IRequirementCreateRequest {
    title: string;
    description: string;
    type: string;
    order: number;
}

export interface IRequirementUpdateRequest {
    title: string;
    description: string;
    type: string;
    order: number;
}
