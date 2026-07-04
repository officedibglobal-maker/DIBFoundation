"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/utils";
import { type ImpactStoreCategory } from "@/types/impact-store-category";
import {
  type ImpactStoreProduct,
  type ImpactStoreProductStatus,
  type ProductUploadFiles,
} from "@/types/impact-store-product";

export type ProductFormData = Omit<
  ImpactStoreProduct,
  "id" | "createdAt" | "updatedAt"
>;

interface ProductFormProps {
  product?: ImpactStoreProduct;
  categories: ImpactStoreCategory[];
  onSave: (
    productData: ProductFormData,
    files: ProductUploadFiles,
  ) => Promise<void>;
  saving: boolean;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function createInitialProductData(
  initialProduct?: ImpactStoreProduct,
): ProductFormData {
  return {
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    shortDescription: initialProduct?.shortDescription ?? "",
    description: initialProduct?.description ?? "",
    price: initialProduct?.price ?? 0,
    currency: initialProduct?.currency ?? "GHS",
    categoryId: initialProduct?.categoryId ?? "",
    categoryName: initialProduct?.categoryName ?? "",
    imageUrl: initialProduct?.imageUrl ?? "",
    images: initialProduct?.images ?? [],
    stockQuantity: initialProduct?.stockQuantity ?? 0,
    status: initialProduct?.status ?? "draft",
    featured: initialProduct?.featured ?? false,
    order: initialProduct?.order ?? 0,
    active: initialProduct?.active ?? true,
    published: initialProduct?.published ?? false,
  };
}

export function ProductForm({
  product: initialProduct,
  categories,
  onSave,
  saving,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductFormData>(
    createInitialProductData(initialProduct),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState("");

  useEffect(() => {
    setProduct(createInitialProductData(initialProduct));
  }, [initialProduct]);

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

  function handleChange<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) {
    setProduct((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const name = event.target.value;

    setProduct((current) => ({
      ...current,
      name,
      slug: generateSlug(name),
    }));
  }

  function handleCategoryChange(categoryId: string) {
    const category = categories.find(
      (item) => item.id === categoryId,
    );

    setProduct((current) => ({
      ...current,
      categoryId,
      categoryName: category?.name ?? "",
    }));
  }

  function handleImageFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      toast({
        title: "Invalid image type",
        description:
          "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "Image too large",
        description:
          "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    setImageFile(file);
  }

  function validate() {
    const errors: Record<string, string> = {};

    if (!product.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!product.categoryId) {
      errors.category = "Category is required";
    }

    if (product.price < 0) {
      errors.price = "Price must be zero or greater";
    }

    if (product.stockQuantity < 0) {
      errors.stock = "Stock must be zero or greater";
    }

    if (!initialProduct?.imageUrl && !imageFile) {
      errors.image = "A primary image is required";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || !validate()) {
      return;
    }

    await onSave(product, {
      primaryImage: imageFile ?? undefined,
      galleryImages: galleryFiles,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg bg-white p-8 shadow-md"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <InputField
            label="Product Name"
            id="name"
            value={product.name}
            onChange={handleNameChange}
            error={validationErrors.name}
          />

          <InputField
            label="Slug"
            id="slug"
            value={product.slug}
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) => {
              handleChange("slug", event.target.value);
            }}
            error={validationErrors.slug}
            helpText="URL-friendly version of the name."
          />

          <TextareaField
            label="Short Description"
            id="shortDescription"
            value={product.shortDescription}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement>,
            ) => {
              handleChange(
                "shortDescription",
                event.target.value,
              );
            }}
          />

          <TextareaField
            label="Full Description"
            id="description"
            value={product.description}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement>,
            ) => {
              handleChange(
                "description",
                event.target.value,
              );
            }}
            rows={6}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={product.status}
              onValueChange={(
                value: ImpactStoreProductStatus,
              ) => {
                handleChange("status", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="published">
                  Published
                </SelectItem>
                <SelectItem value="draft">
                  Draft
                </SelectItem>
                <SelectItem value="archived">
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <Select
              value={product.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => {
                  const categoryId = category.id;

                  if (!categoryId) {
                    return null;
                  }

                  return (
                    <SelectItem
                      key={categoryId}
                      value={categoryId}
                    >
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.category}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={product.featured}
              onCheckedChange={(checked) => {
                handleChange("featured", checked === true);
              }}
            />

            <Label htmlFor="featured">
              Featured Product
            </Label>
          </div>

          <InputField
            label="Display Order"
            id="order"
            type="number"
            value={String(product.order)}
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) => {
              handleChange(
                "order",
                Number.parseInt(
                  event.target.value || "0",
                  10,
                ),
              );
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <InputField
          label="Price"
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={String(product.price)}
          onChange={(
            event: ChangeEvent<HTMLInputElement>,
          ) => {
            handleChange(
              "price",
              Number.parseFloat(event.target.value) || 0,
            );
          }}
          error={validationErrors.price}
        />

        <InputField
          label="Currency"
          id="currency"
          value={product.currency}
          onChange={(
            event: ChangeEvent<HTMLInputElement>,
          ) => {
            handleChange("currency", event.target.value);
          }}
        />

        <InputField
          label="Stock Quantity"
          id="stockQuantity"
          type="number"
          min="0"
          value={String(product.stockQuantity)}
          onChange={(
            event: ChangeEvent<HTMLInputElement>,
          ) => {
            handleChange(
              "stockQuantity",
              Number.parseInt(
                event.target.value || "0",
                10,
              ),
            );
          }}
          error={validationErrors.stock}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Primary Image</Label>

        <Input
          id="imageUrl"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageFileChange}
        />

        {validationErrors.image && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.image}
          </p>
        )}

        {product.imageUrl && !imageFile && (
          <img
            src={product.imageUrl}
            alt="Current primary product"
            className="mt-2 h-24 w-24 rounded-md object-cover"
          />
        )}

        {primaryPreviewUrl && (
          <img
            src={primaryPreviewUrl}
            alt="New primary product preview"
            className="mt-2 h-24 w-24 rounded-md object-cover"
          />
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : initialProduct
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

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