export interface IEventType {
    id: any;
    name: string;
    description: string;
}

export interface IEventTypeCreateRequest {
    name: string;
    description: string;
}

export interface IEventTypeUpdateRequest {
    name: string;
    description: string;
}
