"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import type { ListingsSegment } from "@/lib/listings-segment";
import { easePremium, motionDuration } from "@/lib/motion";

type ListingsSegmentTransitionProps = {
  segment: ListingsSegment;
  children: ReactNode;
};

export function ListingsSegmentTransition({
  segment,
  children,
}: ListingsSegmentTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={segment}
        className="listings-segment-panel"
        /* Sticky (filters) breaks when a parent has transform.
           Keep transitions premium but transform-free. */
        initial={{ opacity: 0, filter: "blur(6px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(6px)" }}
        transition={{
          duration: motionDuration.normal,
          ease: easePremium,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
