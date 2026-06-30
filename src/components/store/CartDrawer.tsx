
'use client';

import * as React from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, addItem, removeItem, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l shadow-2xl">
        <SheetHeader className="p-6 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-secondary font-headline">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Your Impact Cart ({totalItems()})
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-secondary">Your cart is empty</p>
                <p className="text-sm text-muted-foreground px-8">Every purchase from the store supports our community healthcare initiatives.</p>
              </div>
              <Button variant="outline" className="mt-4 rounded-full px-8" onClick={() => setIsOpen(false)}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border bg-white shadow-sm">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-sm text-secondary line-clamp-2 leading-snug">{item.name}</h4>
                      <p className="text-sm text-primary font-bold mt-1.5">{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-muted rounded-full p-1 h-8">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addItem(item)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          const qty = item.quantity;
                          for(let i=0; i<qty; i++) removeItem(item.id);
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="p-6 border-t bg-secondary text-white space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center font-headline">
              <span className="text-white/60 font-medium">Estimated Contribution</span>
              <span className="text-2xl font-bold text-accent">${totalPrice().toFixed(2)}</span>
            </div>
            
            <p className="text-[10px] text-white/40 leading-relaxed italic text-center">
              All proceeds are strictly audited and funneled directly into DIBF Outreach Programs. 
              Inquiry-based checkout allows us to coordinate logistics personally.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <Button asChild onClick={handleCheckout} className="h-14 font-bold shadow-xl bg-accent hover:bg-accent/90 text-white rounded-xl">
                <Link href="/contact?type=store-inquiry" className="flex items-center justify-center gap-2">
                  Initiate Impact Inquiry <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={clearCart} className="text-white/60 hover:text-white hover:bg-white/5">
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
