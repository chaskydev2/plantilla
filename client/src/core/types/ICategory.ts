export interface ICategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string | null;
  icon: string | null;
  timestamps: {
    created_at: string;
    updated_at: string;
  };
  // Optional computed properties from the model
  children_count?: number;
  contractors_count?: number;
  professions_count?: number;
  depth?: number;
  path?: string;
  // Relationships
  parent?: ICategory | null;
  children?: ICategory[];
}

export interface ICategoryCreateRequest {
  name: string;
  slug?: string;
  parent_id?: number | null;
  description?: string;
  icon?: string;
}

export interface ICategoryUpdateRequest {
  name?: string;
  slug?: string;
  parent_id?: number | null;
  description?: string;
  icon?: string;
}

// Tree structure interface for hierarchical display
export interface ICategoryTree {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parent_id: number | null;
  depth: number;
  path: string;
  children: ICategoryTree[];
}

// Helper interface for parent selection dropdown
export interface ICategoryOption {
  value: number | null;
  label: string;
  depth?: number;
}

// Helper function to get categories formatted for select dropdown
export const formatCategoriesForSelect = (categories: ICategory[]): ICategoryOption[] => {
  const options: ICategoryOption[] = [
    { value: null, label: 'No Parent Category (Root)' }
  ];

  const addCategoryOption = (category: ICategory, depth = 0) => {
    const indent = '—'.repeat(depth);
    options.push({
      value: category.id,
      label: `${indent} ${category.name}`,
      depth
    });

    if (category.children) {
      category.children.forEach(child => addCategoryOption(child, depth + 1));
    }
  };

  categories.forEach(category => addCategoryOption(category));
  return options;
};

// Helper function to check if category is parent
export const isParentCategory = (category: ICategory): boolean => {
  return category.parent_id === null;
};

// Helper function to check if category has children
export const hasChildren = (category: ICategory): boolean => {
  return category.children_count ? category.children_count > 0 : false;
};