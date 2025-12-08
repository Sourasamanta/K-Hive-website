"use client";
import React,{ useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// Toast Context and Hook
const ToastContext = React.createContext(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/50',
    error: 'bg-red-500/10 border-red-500/50',
    warning: 'bg-yellow-500/10 border-yellow-500/50',
    info: 'bg-blue-500/10 border-blue-500/50',
  };

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 
        min-w-[300px] max-w-[400px]
        px-4 py-3 
        rounded-lg border
        shadow-lg
        ${bgColors[toast.type]}
        ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1 text-sm text-white">
        {toast.message}
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideOut {
          animation: slideOut 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

// Demo Component
export default function ToastDemo() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#1a1a1b] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Toast Alert System</h1>
          
          <div className="bg-[#272729] rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Try the alerts:</h2>
            
            <ToastButtons />
          </div>
          
          <div className="mt-8 bg-[#272729] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Integration Example:</h2>
            <pre className="bg-[#1a1a1b] text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
            </pre>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

// Demo buttons component
function ToastButtons() {
  const { showToast } = useToast();

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => showToast('Post created successfully!', 'success')}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Show Success
      </button>
      
      <button
        onClick={() => showToast('Failed to create post', 'error')}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Show Error
      </button>
      
      <button
        onClick={() => showToast('Please check your input', 'warning')}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Show Warning
      </button>
      
      <button
        onClick={() => showToast('Processing your request...', 'info')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Show Info
      </button>
      
      <button
        onClick={() => {
          showToast('First notification', 'success');
          setTimeout(() => showToast('Second notification', 'info'), 500);
          setTimeout(() => showToast('Third notification', 'warning'), 1000);
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors col-span-2"
      >
        Show Multiple
      </button>
    </div>
  );
}