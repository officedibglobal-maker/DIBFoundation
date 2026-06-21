
"use client";

import * as React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  className?: string;
  staggerChildren?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.8,
  className,
  staggerChildren = 0
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : (direction === 'up' ? distance : direction === 'down' ? -distance : 0),
      x: shouldReduceMotion ? 0 : (direction === 'left' ? distance : direction === 'right' ? -distance : 0),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.4 : duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
        staggerChildren: staggerChildren
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const RevealItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
