"use client";

import * as React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AIBotAssistant } from '@/components/ai/AIBotAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export function ClientLayout({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const isAdminRoute = pathname.startsWith('/admin');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <FirebaseClientProvider>
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={isAdminRoute ? '' : 'min-h-screen'}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isAdminRoute && <Footer />}
      {mounted && !isAdminRoute && <AIBotAssistant />}
      <Toaster />
    </FirebaseClientProvider>
  );
}
