'use client';

import { motion, type Variants } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  isDarkTheme?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  isDarkTheme = false,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={`${isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left'} ${className}`}
    >
      {eyebrow ? (
        <p
          className={`mb-3 text-sm font-extrabold uppercase tracking-[0.22em] ${
            isDarkTheme ? 'text-blue-200' : 'text-primary'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`text-3xl font-black tracking-tight md:text-4xl lg:text-5xl ${
          isDarkTheme ? 'text-white' : 'text-secondary'
        }`}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={`mt-5 text-base leading-8 md:text-lg ${
            isDarkTheme ? 'text-white/70' : 'text-muted-foreground'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}