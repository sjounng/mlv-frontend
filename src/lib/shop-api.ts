// 사용자 웹상점 API (공개 조회 + 구매). 구매는 인증 필요.
import { api } from "@/lib/api";
import type { Product } from "@/components/shop/ProductCard";

export interface ShopCategory {
  id: number;
  name: string;
  sortOrder: number;
  active: boolean;
}

export type PurchaseLimitType = "NONE" | "WEEKLY" | "MONTHLY" | "ONCE";

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
  purchaseLimitType?: PurchaseLimitType;
  purchaseLimitCount?: number;
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
    limitType: p.purchaseLimitType ?? "NONE",
    limitCount: p.purchaseLimitCount ?? 1,
  };
}

export interface ShopPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

// 캐시 충전 상품(패키지) — 07-22 웹상점 개편
export interface CashProductResponse {
  id: number;
  name: string;
  priceKrw: number;
  cashAmount: number;
  iconUrl: string | null;
  sortOrder: number;
  active: boolean;
}

export const shopApi = {
  categories: () => api.get<ShopCategory[]>("/api/shop/categories"),
  // 서버가 페이지네이션 응답으로 바뀌었다. UI 페이저가 생기기 전까지는 최대 크기로 한 번에 가져온다.
  products: (page = 0, size = 100) =>
    api.get<ShopPage<ShopProductResponse>>(`/api/shop/products?page=${page}&size=${size}`),
  product: (id: string) => api.get<ShopProductResponse>(`/api/shop/products/${id}`),
  purchase: (productId: number, quantity: number) =>
    api.post<{ orderNumber: string }>("/api/shop/purchases", { productId, quantity }),

  // 캐시 충전 상품
  cashProducts: () => api.get<CashProductResponse[]>("/api/shop/cash-products"),
  cashProduct: (id: string) => api.get<CashProductResponse>(`/api/shop/cash-products/${id}`),
  cashProductDescription: () =>
    api.get<{ description: string }>("/api/shop/cash-product-description"),
};
