export interface IAttribute {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  required_for: 'homeowner' | 'contractor' | 'both';
  timestamps: {
    created_at: string;
    updated_at: string;
  };
  // Optional computed properties from the model
  contractors_count?: number;
  homeowners_count?: number;
  users_count?: number;
  required_for_label?: string;
}

export interface IAttributeCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  required_for: 'homeowner' | 'contractor' | 'both';
}

export interface IAttributeUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
  required_for?: 'homeowner' | 'contractor' | 'both';
}

// Constants matching the Laravel model
export const REQUIRED_FOR_OPTIONS = {
  homeowner: 'Homeowner',
  contractor: 'Contractor',
  both: 'Both'
} as const;

export type RequiredForType = keyof typeof REQUIRED_FOR_OPTIONS;

// Helper function to get required_for options for select fields
export const getRequiredForOptions = () => [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'both', label: 'Both' }
];