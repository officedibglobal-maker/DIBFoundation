'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const CartPage: NextPage = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Your Cart is Empty
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Looks like you haven't added anything to your cart yet. Browse our Impact Store to find products that support our mission.
      </p>
        <Button asChild className="mt-6">
            <Link href="/impact-store">Shop Now</Link>
        </Button>
    </div>

  </div>
);

export default CartPage;
