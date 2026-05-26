"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";

type MotionInViewProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
  stagger?: boolean;
  once?: boolean;
};

function listClasses(as: string, stagger: boolean, className?: string) {
  return cn(stagger && as === "ul" && "list-none p-0 m-0", className);
}

export function MotionInView({
  children,
  className,
  as = "div",
  stagger = true,
  once = true,
}: MotionInViewProps) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const Static = as;

  if (!mounted || reduceMotion) {
    return <Static className={listClasses(as, stagger, className)}>{children}</Static>;
  }

  const Component = motion[as];

  return (
    <Component
      className={listClasses(as, stagger, className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={stagger ? staggerContainer : fadeUp}
    >
      {children}
    </Component>
  );
}

export function MotionItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const Static = as;

  if (!mounted || reduceMotion) {
    return <Static className={className}>{children}</Static>;
  }

  const Component = motion[as];

  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
