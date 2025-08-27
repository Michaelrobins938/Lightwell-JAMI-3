import { Variants } from 'framer-motion';

export const slideIn: Variants = {
  hidden: {
    x: -300,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

export const slideDown: Variants = {
  hidden: {
    y: -10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

export const typingDots: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0.3,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// OpenAI-style animation variants for the meet-jamie showcase
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Enhanced version with more cinematic feel
export const enhancedFadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.95,
    filter: "blur(4px)"
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1, 
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    } 
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export const floatLoop: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const counterTransition = { duration: 2, ease: "easeOut" };

export const parallaxSlow: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

export const parallaxMedium: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const orbBreathing: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.7, 0.5],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shimmerEffect: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 3, repeat: Infinity, ease: "linear" },
  },
};

// Enhanced Cinematic Animations for Index Page
export const cinematicFadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 80,
      damping: 20
    } 
  },
};

export const cinematicStagger: Variants = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
    } 
  },
};

export const cardReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    rotateX: -15,
    scale: 0.9
  },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
      damping: 25
    }
  }),
};

export const iconPulse: Variants = {
  hidden: { scale: 1, opacity: 0.7 },
  visible: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.8],
    transition: {
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.3, 1]
    }
  },
};

export const gridReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    rotate: -2
  },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0, 
    rotate: 0,
    transition: { 
      duration: 0.6, 
      delay: i * 0.1,
      ease: "easeOut"
    }
  }),
};

export const counterAnimation: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

export const glowExpand: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.8, 1.2, 1],
    opacity: [0, 0.6, 0.3],
    transition: {
      duration: 1.5,
      ease: "easeOut",
      times: [0, 0.5, 1]
    }
  },
};

export const gradientSweep: Variants = {
  hidden: { backgroundPosition: "0% 50%" },
  visible: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear"
    }
  },
};

export const buttonSpring: Variants = {
  hidden: { 
    scale: 0.9, 
    opacity: 0,
    y: 20
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 1
    } 
  },
  hover: {
    scale: 1.05,
    y: -2,
    boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};