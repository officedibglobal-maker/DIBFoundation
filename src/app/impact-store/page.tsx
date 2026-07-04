"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Filter,
  Heart,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { RevealItem } from "@/components/shared/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { useCart } from "@/hooks/use-cart";
import { COLLECTIONS } from "@/lib/firestore/collections";
import {
  impactStoreCategoryConverter,
  impactStoreProductConverter,
} from "@/lib/firestore/converters";

function ImpactStorePageContent() {
  const { db, status, error } = useFirestore();
  const addItem = useCart((state) => state.addItem);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const productsQuery = useMemo(() => {
    if (status !== "ready" || !db) {
      return null;
    }

    const productsRef = collection(
      db,
      COLLECTIONS.impactStore,
    ).withConverter(impactStoreProductConverter);

    return query(
      productsRef,
      where("status", "==", "published"),
      where("active", "==", true),
    );
  }, [db, status]);

  const categoriesQuery = useMemo(() => {
    if (status !== "ready" || !db) {
      return null;
    }

    const categoriesRef = collection(
      db,
      COLLECTIONS.impactStoreCategories,
    ).withConverter(impactStoreCategoryConverter);

    return query(
      categoriesRef,
      where("status", "==", "published"),
    );
  }, [db, status]);

  const {
    data: products,
    loading: productsLoading,
  } = useCollection(productsQuery);

  const {
    data: categories,
    loading: categoriesLoading,
  } = useCollection(categoriesQuery);

  useEffect(() => {
    if (status === "ready" || status === "error") {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    console.info(
      "Loaded public products:",
      products.length,
    );
  }, [products]);

  const selectedCategory = useMemo(
    () => searchParams.get("category") || "all",
    [searchParams],
  );

  const sortedProducts = useMemo(() => {
    return [...products].sort(
      (firstProduct, secondProduct) =>
        (firstProduct.order ?? 0) -
        (secondProduct.order ?? 0),
    );
  }, [products]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort(
      (firstCategory, secondCategory) =>
        (firstCategory.order ?? 0) -
        (secondCategory.order ?? 0),
    );
  }, [categories]);

  const filteredItems = useMemo(() => {
    const normalizedSearchQuery =
      searchQuery.trim().toLowerCase();

    return sortedProducts.filter((item) => {
      const categoryName =
        item.categoryName?.toLowerCase() ?? "";

      const matchesCategory =
        selectedCategory === "all" ||
        categoryName === selectedCategory.toLowerCase();

      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        item.name
          .toLowerCase()
          .includes(normalizedSearchQuery) ||
        item.description
          .toLowerCase()
          .includes(normalizedSearchQuery) ||
        item.shortDescription
          ?.toLowerCase()
          .includes(normalizedSearchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [
    searchQuery,
    selectedCategory,
    sortedProducts,
  ]);

  function handleCategoryChange(slug: string) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    const queryString = params.toString();

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
    );
  }

  function clearFilters() {
    setSearchQuery("");
    handleCategoryChange("all");
  }

  const impactBenefits = [
    "Health and community wellbeing",
    "Youth empowerment",
    "Mental health awareness",
    "Medical outreach initiatives",
    "Sustainable giving efforts",
    "Humanitarian programs",
  ];

  if (
    isLoading ||
    productsLoading ||
    categoriesLoading
  ) {
    return <ImpactStoreLoadingState />;
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-muted/30">
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
            <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />

            <h1 className="mb-2 text-2xl font-bold text-secondary">
              Impact Store unavailable
            </h1>

            <p className="text-sm text-muted-foreground">
              {error?.message ??
                "The Impact Store could not be loaded. Please try again later."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-secondary py-24 text-white">
        <div className="container relative z-10 mx-auto max-w-4xl space-y-8 px-4 text-center">
          <RevealItem>
            <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/20 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent">
              DIBF Impact Store
            </span>

            <h1 className="font-headline text-4xl font-bold leading-tight md:text-6xl">
              Shop With Purpose.
              <br />

              <span className="text-accent">
                Support Meaningful Impact.
              </span>
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="font-body text-lg italic leading-relaxed text-white/80 md:text-xl">
              “The DIBF Impact Store transforms
              everyday purchases into opportunities for
              impact. Through purpose-driven products,
              every purchase contributes toward
              initiatives that advance health, human
              dignity, and sustainable development.”
            </p>
          </RevealItem>
        </div>

        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </section>

      <section
        id="products"
        className="sticky top-[72px] z-40 border-b bg-white py-12 shadow-sm md:top-[80px]"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <Button
                type="button"
                variant={
                  selectedCategory === "all"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  handleCategoryChange("all")
                }
                className="h-9 gap-2 rounded-full px-4 text-xs"
              >
                <Filter className="h-3.5 w-3.5" />
                All Collections
              </Button>

              {sortedCategories.map((category) => (
                <Button
                  key={category.id ?? category.slug}
                  type="button"
                  variant={
                    selectedCategory === category.slug
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    handleCategoryChange(category.slug)
                  }
                  className="h-9 gap-2 rounded-full px-4 text-xs"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="search"
                aria-label="Search Impact Store products"
                placeholder="Search products..."
                className="h-10 rounded-full border-muted pl-10"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-muted bg-white py-20 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />

              <p className="mb-4 font-medium text-muted-foreground">
                No products found in this collection.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => {
                const productId = item.id;

                return (
                  <RevealItem
                    key={productId ?? item.slug ?? index}
                  >
                    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-none bg-white shadow-lg transition-all duration-500 hover:shadow-2xl">
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <Image
                          src={
                            item.imageUrl ||
                            "/images/impact-store/dibf-hope-tshirt.svg"
                          }
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />

                        <div className="absolute left-4 top-4">
                          <Badge className="bg-primary/90 text-white shadow-sm backdrop-blur-sm">
                            {item.categoryName}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="p-6 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-1 text-lg font-bold text-secondary transition-colors group-hover:text-primary">
                            {item.name}
                          </CardTitle>

                          <span className="shrink-0 font-bold text-primary">
                            {item.currency}{" "}
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4 p-6 pt-0">
                        <p className="line-clamp-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>

                        {item.shortDescription && (
                          <div className="flex items-start gap-3 rounded-xl border border-accent/10 bg-accent/5 p-3">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

                            <div className="text-[11px] font-bold uppercase leading-tight tracking-wider text-accent-foreground">
                              <span className="mb-0.5 block opacity-60">
                                Impact Note:
                              </span>

                              {item.shortDescription}
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <Button
                          type="button"
                          disabled={
                            !productId ||
                            item.stockQuantity <= 0
                          }
                          onClick={() => {
                            if (!productId) {
                              return;
                            }

                            addItem({
                              id: productId,
                              name: item.name,
                              price: item.price,
                              imageUrl: item.imageUrl,
                              quantity: 1,
                            });
                          }}
                          className="w-full gap-2 font-bold shadow-md transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <ShoppingBag className="h-4 w-4" />

                          {item.stockQuantity > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </RevealItem>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="font-headline text-3xl font-bold md:text-5xl">
                Support Through Every Purchase
              </h2>

              <p className="max-w-xl text-lg text-white/70">
                When you shop through the DIBF Impact
                Store, you are directly supporting
                initiatives that contribute to:
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {impactBenefits.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <Heart className="h-5 w-5 shrink-0 text-accent" />

                    <span className="text-sm font-medium">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <h3 className="font-headline text-3xl font-bold">
                Every item purchased contributes toward
                initiatives supported by DIBF.
              </h3>

              <p className="leading-relaxed text-white/60">
                The DIBF Impact Store represents a
                culture of purpose, awareness, and shared
                responsibility, where products become
                conversation starters and tools for
                positive change.
              </p>

              <Button
                asChild
                size="lg"
                className="h-14 px-10 font-bold"
              >
                <Link href="/contact?type=bulk-inquiry">
                  Bulk &amp; Corporate Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactStoreLoadingState() {
  return (
    <main className="min-h-screen bg-muted/30">
      <section className="bg-secondary py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto h-8 w-52 animate-pulse rounded-full bg-white/10" />

          <div className="mx-auto mt-6 h-14 max-w-2xl animate-pulse rounded-xl bg-white/10" />

          <div className="mx-auto mt-5 h-20 max-w-xl animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ),
          )}
        </div>
      </section>
    </main>
  );
}

export default function ImpactStorePage() {
  return (
    <Suspense fallback={<ImpactStoreLoadingState />}>
      <ImpactStorePageContent />
    </Suspense>
  );
}