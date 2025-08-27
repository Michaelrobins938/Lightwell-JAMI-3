import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { CheckCircle } from 'lucide-react';

interface SignupSuccessModalProps {
  show: boolean;
  onClose?: () => void;
  autoRedirectDelay?: number; // in milliseconds, default 2500 (2.5 seconds)
}

export default function SignupSuccessModal({
  show,
  onClose,
  autoRedirectDelay = 2500
}: SignupSuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleContinue();
      }, autoRedirectDelay);

      return () => clearTimeout(timer);
    }
  }, [show, autoRedirectDelay]);

  const handleContinue = () => {

    if (onClose) {
      onClose();
    }
    router.push('/onboarding');
  };

  if (!show) return null;



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleContinue}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-sm mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 20
            }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Account created successfully!
          </motion.h2>

          {/* Success Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-8"
          >
            Let's get started with your setup.
          </motion.p>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={handleContinue}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg shadow-emerald-600/25"
          >
            Continue
          </motion.button>

          {/* Auto-redirect hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs text-gray-500 mt-4"
          >
            Auto-redirecting in {Math.ceil(autoRedirectDelay / 1000)} seconds...
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
