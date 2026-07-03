
import { ImpactStoreCategory } from "@/types/impact-store-category";
import Link from "next/link";

interface ImpactStoreCategoryCardProps {
  category: ImpactStoreCategory;
}

export default function ImpactStoreCategoryCard({ category }: ImpactStoreCategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/impact-store/category/${category.id}`}>
        <img src={category.imageUrl} alt={category.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </Link>
    </div>
  );
}
