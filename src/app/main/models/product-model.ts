export interface Product {
  code: string;
  quantity: number;
  section: number;
  floor: number
}

export interface Floor {
  id:number;
  name: string;
  products: Product[];
}

