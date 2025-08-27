import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-display font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-luna-violet/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const variants = {
    primary: 'bg-gradient-to-r from-luna-violet to-[#7e57c2] text-white hover:from-[#8b5cf6] hover:to-[#7c3aed] shadow-lg hover:shadow-xl drop-shadow-[0_2px_8px_rgba(156,99,255,0.25)]',
    secondary: 'border-2 border-luna-violet text-luna-violet bg-transparent hover:bg-luna-violet hover:text-white shadow-lg hover:shadow-xl',
    tertiary: 'text-luna-violet hover:text-[#7e57c2] bg-transparent hover:bg-luna-violet/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl'
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02, 
      boxShadow: '0 8px 32px 0 rgba(156,99,255,0.15)',
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      variants={buttonVariants}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && iconPosition === 'left' && !loading && icon}
        <span className={loading ? 'opacity-50' : ''}>
          {children}
        </span>
        {icon && iconPosition === 'right' && !loading && icon}
      </div>
    </motion.button>
  );
}