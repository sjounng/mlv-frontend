import ShopNavbar from "@/components/shop/ShopNavbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <ShopNavbar activeTab="홈" />
      {children}
    </div>
  );
}
