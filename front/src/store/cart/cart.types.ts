export interface ICartItem {
  id: number;
  quantity: number;
  selected: boolean;
  product: {
    id: number;
    title: string;
    price: number;
    images: string[];
  };
}

export interface IPromocode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  validUntil?: Date;
  maxUses?: number;
  usedCount: number;
  description?: string;
}

export interface ICart {
  items: ICartItem[];
  promocode?: IPromocode;
  total: number;
  discountedTotal?: number;
}
