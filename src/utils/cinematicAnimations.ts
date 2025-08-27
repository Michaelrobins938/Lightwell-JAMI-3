import { Variants } from 'framer-motion';

// Enhanced cinematic entrance animations for sections
export const sectionEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 0
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier for smooth feel
      staggerChildren: 0.12, // Stagger child elements
      delayChildren: 0.1
    }
  }
};

// Text block animations - fade up from below
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Heading animations with subtle scale
export const headingReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

// Image/mockup scale-in animation
export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 15
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  }
};

// Button/CTA animations with spring
export const buttonReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      damping: 20,
      stiffness: 400
    }
  }
};

// Card/feature animations with subtle parallax
export const cardRevealStagger: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.96,
    rotateX: 5
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  }
};

// Container for staggered children
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.3
    }
  }
};

// Fast stagger for smaller elements
export const fastStagger: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Slow, cinematic stagger for major sections
export const cinematicStagger: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.8
    }
  }
};

// Hover animations for interactive elements
export const hoverLift: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Subtle parallax tilt on hover
export const parallaxTilt: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    rotateX: -2,
    rotateY: 2,
    scale: 1.01,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Scroll-triggered entrance (for intersection observer)
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

// Mobile-optimized animations (faster, less motion)
export const mobileTextReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 15
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const mobileImageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Utility for detecting mobile
export const isMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

// Get animation variant based on device
export const getDeviceVariant = (desktop: Variants, mobile: Variants) => {
  return isMobile() ? mobile : desktop;
};