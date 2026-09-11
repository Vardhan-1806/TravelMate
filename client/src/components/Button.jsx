import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'text-sm font-medium rounded-xl transition-colors py-3 px-6';
  const variants = {
    primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white disabled:opacity-60 shadow-sm shadow-black/5',
    coral: 'bg-[var(--color-coral)] hover:brightness-95 text-white disabled:opacity-60 shadow-sm shadow-black/5',
    secondary: 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
