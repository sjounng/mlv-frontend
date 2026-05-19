import ShopSidebar from "@/components/shop/ShopSidebar";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductGrid from "@/components/shop/ProductGrid";
import RightSidebar from "@/components/shop/RightSidebar";
import { featuredProducts, allProducts } from "@/lib/shop-data";

export default function ShopPage() {
  return (
    <div className="flex flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 gap-5">
      {/* Left sidebar */}
      <ShopSidebar activeCategory="all" />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col gap-5">
        <HeroBanner />
        <ProductGrid featuredProducts={featuredProducts} allProducts={allProducts} />
      </main>

      {/* Right sidebar */}
      <RightSidebar />
    </div>
  );
}
