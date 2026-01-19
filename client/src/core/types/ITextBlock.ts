export interface ITextBlock {
    id: number;
    text_primary: string;
    text_secondary: string;
    text_tertiary: string;
    created_at?: string;
    updated_at?: string;
}

export interface ITextBlockCreateRequest {
    text_primary: string;
    text_secondary: string;
    text_tertiary: string;
}

export interface ITextBlockUpdateRequest {
    text_primary?: string;
    text_secondary?: string;
    text_tertiary?: string;
}
