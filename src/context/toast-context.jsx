import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, Warning, Info, XCircle, X } from 'phosphor-react';
import clsx from 'clsx';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in-right transition-all",
                            toast.type === 'success' ? "bg-white border-l-4 border-green-500 text-gray-800" :
                                toast.type === 'error' ? "bg-white border-l-4 border-red-500 text-gray-800" :
                                    "bg-white border-l-4 border-blue-500 text-gray-800"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle size={24} className="text-green-500" weight="fill" />}
                        {toast.type === 'error' && <XCircle size={24} className="text-red-500" weight="fill" />}
                        {toast.type === 'info' && <Info size={24} className="text-blue-500" weight="fill" />}

                        <p className="text-sm font-medium flex-1">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
