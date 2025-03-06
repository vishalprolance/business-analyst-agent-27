
/**
 * Animation utilities for consistent usage across components
 */

export const fadeInAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
};

export const staggerChildren = (delay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay
    }
  }
});

export const slideUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
};

export const scaleAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
};

export const blurAnimation = {
  initial: { opacity: 0, filter: 'blur(12px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
};

export const popAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// For sequencing animations when needed
export const getDelayedAnimation = (delay: number, animation: any) => ({
  ...animation,
  transition: {
    ...animation.transition,
    delay
  }
});
