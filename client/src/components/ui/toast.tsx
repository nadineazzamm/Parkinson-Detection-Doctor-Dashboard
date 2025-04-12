// src/components/ui/toast.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [lastId, setLastId] = useState(0);

  const addToast = (props: ToastProps) => {
    const id = lastId + 1;
    setLastId(id);
    setToasts(prev => [...prev, { ...props, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<ToastProps & { id: number; onClose: () => void }> = ({ 
  title, 
  description, 
  variant = 'default', 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'destructive':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastClass = () => {
    const baseClasses = "flex w-full max-w-md shadow-lg rounded-lg overflow-hidden p-4 animate-in slide-in-from-right-full";
    
    switch (variant) {
      case 'destructive':
        return `${baseClasses} bg-red-50 border-l-4 border-red-500`;
      case 'success':
        return `${baseClasses} bg-emerald-50 border-l-4 border-emerald-500`;
      case 'warning':
        return `${baseClasses} bg-amber-50 border-l-4 border-amber-500`;
      default:
        return `${baseClasses} bg-white border-l-4 border-blue-500`;
    }
  };

  return (
    <div className={getToastClass()}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-grow">
        {title && <h4 className="text-sm font-medium text-gray-900">{title}</h4>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const toast = (props: ToastProps) => {
  // This function is a placeholder for imports
  // The actual implementation happens through the useToast hook
  console.warn("Direct toast import used outside of ToastProvider. Use useToast hook instead.");
  
  // Show a fallback browser alert if the toast is called outside the provider
  const { title, description } = props;
  const message = `${title ? title + ': ' : ''}${description || ''}`;
  if (message) alert(message);
};