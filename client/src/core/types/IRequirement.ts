export interface IRequirement {
    id: any;
    title: string;
    description: string;
    type: string;
    order: number;
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
