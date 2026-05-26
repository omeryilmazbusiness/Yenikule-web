/** Premium easing — matches CSS --ease-premium */
export const easePremium = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  fast: 0.35,
  normal: 0.55,
  slow: 0.75,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.normal, ease: easePremium },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionDuration.normal, ease: easePremium },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const drawerItem = {
  hidden: { opacity: 0, x: 20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: motionDuration.normal,
      ease: easePremium,
      delay: index * 0.05,
    },
  }),
};
