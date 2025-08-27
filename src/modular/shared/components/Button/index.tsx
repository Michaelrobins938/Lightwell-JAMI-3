import React from 'react';
import { motion } from 'framer-motion';
import { ButtonProps, ButtonVariant, ButtonSize } from './types';
import { cn } from '../../utils/cn';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-gpt5-beam-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gpt5-slate-800/50 hover:bg-gpt5-slate-700/50 text-white border border-white/20',
  outline: 'border-2 border-gpt5-beam-gradient text-white hover:bg-gpt5-beam-gradient hover:text-white',
  ghost: 'hover:bg-white/10 text-slate-300 hover:text-white',
  link: 'text-gpt5-pink hover:text-gpt5-purple underline-offset-4 hover:underline'
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-base rounded-xl', 
  lg: 'px-6 py-3 text-lg rounded-xl',
  xl: 'px-8 py-4 text-xl rounded-2xl'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  onClick,
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gpt5-amber-start/50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  
  return (
    <motion.button
      className={cn(
        baseClasses,
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
};