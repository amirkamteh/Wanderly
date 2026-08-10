import type { Metadata } from "next";
import WishlistContent from "@/components/WishlistContent";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Homes, experiences and services you have saved for later.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistContent />;
}
