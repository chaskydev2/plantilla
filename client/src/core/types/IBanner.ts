export interface IBanner {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
}

export interface IBannerCreateRequest {
    title: string;
    subtitle: string;
    image: string;

}

export interface IBannerUpdateRequest {
    title: string;
    subtitle: string;
    image: string;
}
