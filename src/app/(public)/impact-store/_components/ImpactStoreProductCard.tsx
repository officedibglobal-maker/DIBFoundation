
import { StoredDocument } from "@/types/firestore";
import { ImpactStoreProduct } from "@/types/impact-store-product";
import Link from "next/link";

interface ImpactStoreProductCardProps {
  product: StoredDocument<ImpactStoreProduct>;
}

export default function ImpactStoreProductCard({ product }: ImpactStoreProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/impact-store/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-bold">${product.price}</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add to Cart</button>
          </div>
        </div>
      </Link>
    </div>
  );
}
