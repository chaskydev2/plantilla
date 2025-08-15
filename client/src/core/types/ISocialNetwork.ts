export interface ISocialNetwork {
    id: number;
    url_facebook: string | null;
    url_twitter: string | null;
    url_instagram: string | null;
    url_tiktok: string | null;
    url_linkedin: string | null;
}

export interface ISocialNetworkCreateRequest {
    url_facebook?: string | null;
    url_twitter?: string | null;
    url_instagram?: string | null;
    url_tiktok?: string | null;
    url_linkedin?: string | null;
}

export interface ISocialNetworkUpdateRequest {
    url_facebook?: string | null;
    url_twitter?: string | null;
    url_instagram?: string | null;
    url_tiktok?: string | null;
    url_linkedin?: string | null;
}
