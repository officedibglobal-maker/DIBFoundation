
'use client';

import * as React from 'react';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Sparkles, BrainCircuit, Shirt, ShoppingCart, Filter, Search, Palette } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RevealItem } from '@/components/shared/ScrollReveal';
import { useCart } from '@/hooks/use-cart';
import { Input } from '@/components/ui/input';

export default function ImpactStorePage() {
  const { db, status, error } = useFirestore();
  const addItem = useCart((state) => state.addItem);
  
  const storeQuery = useMemo(() => {
    if (status !== 'ready' || !db) return null;
    return query(collection(db, 'impactStore'), orderBy('order', 'asc'));
  }, [db, status]);

  const { data: items, loading } = useCollection(storeQuery);

  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { name: "All", icon: Filter },
    { name: "Mental health awareness merchandise", icon: BrainCircuit },
    { name: "Apparel and accessories", icon: Shirt },
    { name: "Office and lifestyle items", icon: ShoppingBag },
    { name: "Wellness and fitness products", icon: Heart },
    { name: "Community-inspired products", icon: Palette },
  ];

  const filteredItems = items.filter(item => {
    const itemData = item as any;
    const matchesCategory = activeCategory === 'All' || itemData.category === activeCategory;
    const matchesSearch = itemData.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itemData.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const impactBenefits = [
    "Health and community wellbeing",
    "Youth empowerment",
    "Mental health awareness",
    "Medical outreach initiatives",
    "Sustainable giving efforts",
    "Humanitarian programs"
  ];

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8 max-w-4xl">
          <RevealItem>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest border border-accent/30 mb-4">
              DIBF Impact Store
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
              Shop With Purpose. <br /><span className="text-accent">Support Meaningful Impact.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed italic font-body">
              "The DIBF Impact Store transforms everyday purchases into opportunities for impact. 
              Through purpose-driven products, every purchase contributes toward initiatives that advance 
              health, human dignity, and sustainable development."
            </p>
          </RevealItem>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
      </section>

      {/* Product Filters & Search */}
      <section id="products" className="py-12 bg-white border-b sticky top-[72px] md:top-[80px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {categories.map((cat, i) => (
                <Button
                  key={i}
                  variant={activeCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.name)}
                  className="rounded-full gap-2 text-xs h-9 px-4"
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.name === "All" ? "All Collections" : cat.name.split(' ')[0]}
                </Button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 rounded-full h-10 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-96 bg-white animate-pulse rounded-2xl" />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium mb-4">No products found in this collection.</p>
              <p className="text-sm text-muted-foreground mb-6">If you are the admin, please visit /admin and click "Seed Website Data".</p>
              <Button variant="outline" onClick={() => {setActiveCategory('All'); setSearchQuery('');}}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item, idx) => {
                const itemData = item as any;
                return (
                  <RevealItem key={itemData.id || idx}>
                    <Card className="group h-full flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <Image 
                          src={itemData.imageUrl || "https://picsum.photos/seed/dibf-product/600/600"} 
                          alt={itemData.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 text-white backdrop-blur-sm shadow-sm">{itemData.category}</Badge>
                        </div>
                      </div>
                      <CardHeader className="p-6 pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg font-bold text-secondary line-clamp-1 group-hover:text-primary transition-colors">{itemData.title}</CardTitle>
                          <span className="font-bold text-primary shrink-0">{itemData.price}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 flex-1 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                          {itemData.description}
                        </p>
                        <div className="bg-accent/5 p-3 rounded-xl flex gap-3 items-start border border-accent/10">
                          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <div className="text-[11px] font-bold text-accent-foreground leading-tight uppercase tracking-wider">
                            <span className="opacity-60 block mb-0.5">Impact Note:</span>
                            {itemData.impactNote}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button 
                          onClick={() => addItem({
                            id: itemData.id,
                            title: itemData.title,
                            price: itemData.price,
                            imageUrl: itemData.imageUrl,
                            quantity: 1
                          })}
                          className="w-full gap-2 font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </RevealItem>
                )}
              )}
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold font-headline">Support Through Every Purchase</h2>
              <p className="text-lg text-white/70 max-w-xl">
                When you shop through the DIBF Impact Store, you are directly supporting initiatives that contribute to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {impactBenefits.map((area, i) => (
                  <div key={i} className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <Heart className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10 text-center space-y-8">
              <h3 className="text-3xl font-bold font-headline">Every item purchased contributes toward initiatives supported by DIBF.</h3>
              <p className="text-white/60 leading-relaxed">
                The DIBF Impact Store represents a culture of purpose, awareness, and shared responsibility, 
                where products become conversation starters and tools for positive change.
              </p>
              <Button asChild size="lg" className="h-14 px-10 font-bold">
                <Link href="/contact?type=bulk-inquiry">Bulk & Corporate Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
