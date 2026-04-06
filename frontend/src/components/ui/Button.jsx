import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standardized button for the ERP frontend.
 * Supports primary, secondary, and danger variants.
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus:ring-blue-500/50",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 focus:ring-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 focus:ring-red-500/50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-50 active:scale-95 focus:ring-gray-100"
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
