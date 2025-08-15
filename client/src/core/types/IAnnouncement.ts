export interface IAnnouncement {
    id: any;
    title: string;
    content: string;
    start_date: string;
    image: string;
    type: string;
    published_by: string;
    visible_until: string;
}

export interface IAnnouncementCreateRequest {
    title: string;
    content: string;
    start_date: string;
    image: string;
    type: string;
    published_by: string;
    visible_until: string;
}

export interface IAnnouncementUpdateRequest {
    title: string;
    content: string;
    start_date: string;
    image: string;
    type: string;
    published_by: string;
    visible_until: string;
}
