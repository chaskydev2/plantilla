// @/pages/admin/attribute-contractor/types.ts
export type User = {
  id?: number;
  name?: string;
  email?: string;
  // otros campos si existen...
};

export type Contractor = {
  id?: number;
  user?: User | null;
  // otros campos del contratista
};

export type Attribute = {
  id?: number;
  name?: string;
  // otros campos del atributo
};

export type AttributeContractor = {
  id: number;
  attribute_id?: number | null;
  contractor_id?: number | null;
  value?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: boolean | null;
  coment?: string | null;
  // Relaciones (opcionales porque podrían no venir siempre)
  attribute?: Attribute | null;
  contractor?: Contractor | null;
};
