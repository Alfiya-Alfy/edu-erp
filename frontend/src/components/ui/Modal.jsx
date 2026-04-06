import { X } from "lucide-react";

/**
 * Shared modal component for CRUD operations across the ERP.
 * Supports a close icon and fully-customizable body.
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl"
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 sm:slide-in-from-bottom-2 duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
