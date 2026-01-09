export type User = {
  id?: number;
  name?: string;
  email?: string;
};

export type Homeowner = {
  id?: number;
  user?: User | null;
};

export type Attribute = {
  id?: number;
  name?: string;
};

export type AttributeHomeowner = {
  id: number;
  attribute_id?: number | null;
  homeowner_id?: number | null;
  value?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: boolean | null;
  coment?: string | null;
  attribute?: Attribute | null;
  homeowner?: Homeowner | null;
};
