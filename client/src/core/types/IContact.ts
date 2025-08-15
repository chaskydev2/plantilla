export interface IContact {
    id: any;
    address: string;
    mobile_number: string;
    phone_number: string;
    email: string;
    business_hours: string;

}

export interface IContactCreateRequest {
    address: string;
    mobile_number: string;
    phone_number: string;
    email: string;
    business_hours: string;
}
export interface IContactUpdateRequest {
    address: string;
    mobile_number: string;
    phone_number: string;
    email: string;
    business_hours: string;
}