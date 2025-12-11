import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddRewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (desc: string, amount: number, date: string) => Promise<boolean>;
}

export const AddRewardModal: React.FC<AddRewardModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await onSubmit(desc, parseFloat(amount), date);
        setSubmitting(false);
        if (success) {
            setDesc('');
            setAmount('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-md rounded-2xl flex flex-col max-h-[90vh] shadow-xl animate-in zoom-in-95 duration-200">

                {/* Fixed Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">新增獎金 (手動)</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto overscroll-contain">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">項目說明</label>
                            <input
                                type="text"
                                required
                                placeholder="例如：第一季激勵獎金"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">金額</label>
                                <input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">日期</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-blue-200"
                            >
                                {submitting ? '儲存中...' : '確認新增'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
