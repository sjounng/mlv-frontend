import Navbar from "@/components/Navbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <Navbar />
      <div className="pt-16 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
