'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AIBotAssistant } from '@/components/ai/AIBotAssistant';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [mounted, setMounted] = React.useState(false);

  const isAdminRoute = pathname.startsWith('/admin');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <FirebaseClientProvider>
      {!isAdminRoute ? <Navbar /> : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={isAdminRoute ? 'min-h-screen' : 'min-h-screen bg-white'}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {!isAdminRoute ? <Footer /> : null}

      {mounted && !isAdminRoute ? <AIBotAssistant /> : null}

      <Toaster />
    </FirebaseClientProvider>
  );
}