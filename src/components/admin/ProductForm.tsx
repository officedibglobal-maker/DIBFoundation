
'use client';

import { useState, FC, FormEvent, ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes, useEffect } from 'react';
import { ImpactStoreProduct, ImpactStoreProductStatus, ProductUploadFiles } from '@/types/impact-store-product';
import { ImpactStoreCategory } from '@/types/impact-store-category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { generateSlug } from '@/lib/utils';

export type ProductFormData = Omit<ImpactStoreProduct, 'docId' | 'id' | 'createdAt' | 'updatedAt'>;

interface ProductFormProps {
  product?: ImpactStoreProduct;
  categories: ImpactStoreCategory[];
  onSave: (productData: ProductFormData, files: ProductUploadFiles) => Promise<void>;
  saving: boolean;
}

function createInitialProductData(
  initialProduct?: ImpactStoreProduct
): ProductFormData {
  return {
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    shortDescription:
      initialProduct?.shortDescription ?? "",
    description: initialProduct?.description ?? "",
    price: initialProduct?.price ?? 0,
    currency: initialProduct?.currency ?? "GHS",
    categoryId: initialProduct?.categoryId ?? "",
    categoryName:
      initialProduct?.categoryName ?? "",
    imageUrl: initialProduct?.imageUrl ?? "",
    images: initialProduct?.images ?? [],
    stockQuantity:
      initialProduct?.stockQuantity ?? 0,
    status: initialProduct?.status ?? "draft",
    featured: initialProduct?.featured ?? false,
    order: initialProduct?.order ?? 0,
    active: initialProduct?.active ?? true,
    published: initialProduct?.published ?? false,
  };
}

export const ProductForm: FC<ProductFormProps> = ({ product: initialProduct, categories, onSave, saving }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductFormData>(createInitialProductData(initialProduct));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPrimaryPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPrimaryPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setProduct((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newName = event.target.value;
    setProduct(prev => ({ ...prev, name: newName, slug: generateSlug(newName) }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.docId === categoryId);
    setProduct(prev => ({ ...prev, categoryId: categoryId, categoryName: category?.name || '' }));
  };

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const;

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        toast({ title: 'Invalid image type', description: 'Please upload a JPEG, PNG, or WebP image.', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast({ title: 'Image too large', description: 'Please upload an image smaller than 5MB.', variant: 'destructive' });
        e.target.value = '';
        return;
      }
      setImageFile(file);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!product.name.trim()) errors.name = 'Product name is required';
    if (!product.categoryId) errors.category = 'Category is required';
    if (product.price < 0) errors.price = 'Price must be zero or greater';
    if (product.stockQuantity < 0) errors.stock = 'Stock must be zero or greater';
    if (!initialProduct?.imageUrl && !imageFile) errors.image = 'A primary image is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) {
      return;
    }
    if (validate()) {
      await onSave(product, { primaryImage: imageFile ?? undefined, galleryImages: galleryFiles });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <InputField label="Product Name" id="name" value={product.name} onChange={handleNameChange} error={validationErrors.name} />
          <InputField label="Slug" id="slug" value={product.slug} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("slug", event.target.value)} error={validationErrors.slug} helpText="URL-friendly version of the name." />
          <TextareaField label="Short Description" id="shortDescription" value={product.shortDescription} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleChange("shortDescription", event.target.value)} />
          <TextareaField label="Full Description" id="description" value={product.description} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleChange("description", event.target.value)} rows={6} />
        </div>
        <div className="space-y-6">
          <div>
            <Label>Status</Label>
            <Select onValueChange={(value: ImpactStoreProductStatus) => handleChange('status', value)} value={product.status}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select onValueChange={handleCategoryChange} value={product.categoryId}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.docId} value={cat.docId}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {validationErrors.category && <p className="text-sm text-red-600 mt-1">{validationErrors.category}</p>}
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="featured" checked={product.featured} onCheckedChange={checked => handleChange('featured', !!checked)} />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
          <InputField label="Display Order" id="order" type="number" value={String(product.order)} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("order", Number.parseInt(event.target.value || "0", 10))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField label="Price" id="price" type="number" value={String(product.price)} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("price", parseFloat(event.target.value) || 0)} error={validationErrors.price} />
        <InputField label="Currency" id="currency" value={product.currency} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("currency", event.target.value)} />
        <InputField label="Stock Quantity" id="stockQuantity" type="number" value={String(product.stockQuantity)} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange("stockQuantity", parseInt(event.target.value) || 0)} error={validationErrors.stock} />
      </div>

      <div>
        <Label htmlFor="imageUrl">Primary Image</Label>
        <Input id="imageUrl" type="file" onChange={handleImageFileChange} accept="image/jpeg,image/png,image/webp" />
        {validationErrors.image && <p className="text-sm text-red-600 mt-1">{validationErrors.image}</p>}
        {product.imageUrl && !imageFile && <img src={product.imageUrl} alt="Current primary image" className="mt-2 h-24 w-24 object-cover rounded-md" />}
        {primaryPreviewUrl && <img src={primaryPreviewUrl} alt="New primary image" className="mt-2 h-24 w-24 object-cover rounded-md" />}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (initialProduct ? 'Update Product' : 'Create Product')}</Button>
      </div>
    </form>
  );
};

interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
}

function InputField({
  label,
  id,
  error,
  helpText,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
}

function TextareaField({
  label,
  id,
  error,
  helpText,
  ...props
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} {...props} />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {helpText && (
        <p className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
