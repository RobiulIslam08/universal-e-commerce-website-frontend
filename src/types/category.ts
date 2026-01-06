export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  level: number;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryWithCount extends ICategory {
  productCount: number;
  subCategories?: ICategoryWithCount[];
}

export interface ICategoryTree {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  productCount: number;
  children?: ICategoryTree[];
  subCategories?: ICategoryTree[];
}

export interface ICategoryStats {
  totalCategories: number;
  rootCategories: number;
  topCategories: Array<{
    _id: string;
    count: number;
  }>;
}
