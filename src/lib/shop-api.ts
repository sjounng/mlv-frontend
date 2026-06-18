// 사용자 웹상점 API (공개 조회 + 구매). 구매는 인증 필요.
import { api } from "@/lib/api";
import type { Product } from "@/components/shop/ProductCard";

export interface ShopCategory {
  id: number;
  name: string;
  sortOrder: number;
  active: boolean;
}

export interface ShopProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: ShopCategory;
  mailTemplateId: number;
  active: boolean;
  stockQuantity: number | null;
  recommended: boolean;
  newBadge: boolean;
}

export function toUiProduct(p: ShopProductResponse): Product {
  return {
    id: String(p.id),
    name: p.name,
    desc: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    categoryId: String(p.category.id),
    badge: p.recommended ? "HOT" : p.newBadge ? "NEW" : undefined,
  };
}

export const shopApi = {
  categories: () => api.get<ShopCategory[]>("/api/shop/categories"),
  products: () => api.get<ShopProductResponse[]>("/api/shop/products"),
  product: (id: string) => api.get<ShopProductResponse>(`/api/shop/products/${id}`),
  purchase: (productId: number, quantity: number) =>
    api.post<{ orderNumber: string }>("/api/shop/purchases", { productId, quantity }),
};
