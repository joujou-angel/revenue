import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Client } from '../hooks/useClients';

interface EditClientModalProps {
    client: Client;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: Partial<Client>) => Promise<boolean>;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({ client, isOpen, onClose, onSave }) => {
    const [name, setName] = useState(client.name);
    const [phone, setPhone] = useState(client.phone || '');
    const [idNumber, setIdNumber] = useState(client.id_number || '');
    const [note, setNote] = useState(client.note || '');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(client.name);
            setPhone(client.phone || '');
            setIdNumber(client.id_number || '');
            setNote(client.note || '');
        }
    }, [isOpen, client]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await onSave({ name, phone, id_number: idNumber, note });
        setSubmitting(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl flex flex-col max-h-[90vh] shadow-xl animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">編輯客戶資料</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">姓名</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">電話</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">身分證字號</label>
                            <input
                                type="text"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">備註</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                {submitting ? '儲存變更' : '確認修改'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
