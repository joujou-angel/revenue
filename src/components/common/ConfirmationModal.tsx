import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = '確認',
    cancelText = '取消',
    isDestructive = false,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle size={24} />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        <p className="text-slate-500 mt-2 text-sm">{message}</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform ${isDestructive ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}
                        >
                            {isLoading ? '處理中...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
