export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
  author?: string;
  category?: Category;
  productUrl?: string;
};
