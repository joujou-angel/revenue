import React, { useState } from 'react';
import { Search, FileSignature, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { Contract } from '../hooks/useContracts';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';

interface ContractListProps {
    contracts: Contract[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onDelete?: (id: string) => Promise<boolean>;
    onTerminate?: (id: string) => Promise<boolean>;
}

export const ContractList: React.FC<ContractListProps> = ({ contracts, loading, searchTerm, onSearchChange, onDelete, onTerminate }) => {
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | 'terminate';
        contract: Contract | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        type: 'delete',
        contract: null,
        isLoading: false
    });

    // Helper to determine display status
    const getStatusInfo = (contract: Contract) => {
        const signDate = new Date(contract.sign_date);
        const endDate = new Date(signDate.setMonth(signDate.getMonth() + contract.duration_months));
        const isExpired = new Date() > endDate && contract.status === 'active';

        if (contract.status === 'terminated') {
            return {
                label: '已解約',
                bg: 'bg-red-100',
                text: 'text-red-700',
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500'
            };
        }

        if (contract.status === 'completed' || isExpired) {
            return {
                label: '已完成',
                bg: 'bg-slate-100',
                text: 'text-slate-600',
                iconBg: 'bg-slate-50',
                iconColor: 'text-slate-500'
            };
        }

        return {
            label: '進行中',
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600'
        };
    };

    const handleAction = (e: React.MouseEvent, type: 'delete' | 'terminate', contract: Contract) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            type,
            contract,
            isLoading: false
        });
    };

    const handleConfirm = async () => {
        if (!confirmModal.contract) return;

        setConfirmModal(prev => ({ ...prev, isLoading: true }));

        let success = false;
        if (confirmModal.type === 'delete' && onDelete) {
            success = await onDelete(confirmModal.contract.id);
        } else if (confirmModal.type === 'terminate' && onTerminate) {
            success = await onTerminate(confirmModal.contract.id);
        }

        setConfirmModal(prev => ({ ...prev, isLoading: false, isOpen: !success }));
    };

    const renderModalContent = () => {
        if (confirmModal.type === 'delete') {
            return {
                title: '刪除合約',
                message: '確定要刪除此合約嗎？所有相關的款項紀錄都會被一併刪除，此操作無法復原。',
                confirmText: '確認刪除',
                isDestructive: true
            };
        }
        return {
            title: '提前終止合約',
            message: '確定要提前終止此合約嗎？合約狀態將變更為「已解約」。',
            confirmText: '確認終止',
            isDestructive: true
        };
    };

    const modalContent = renderModalContent();

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="搜尋客戶或保單號碼..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10 text-slate-400">載入中...</div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                    <p>找不到符合的合約</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {contracts.map((contract) => {
                        const status = getStatusInfo(contract);
                        return (
                            <div key={contract.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group relative">
                                <div className="flex items-center gap-4">
                                    <div className={clsx("p-3 rounded-full", status.iconBg, status.iconColor)}>
                                        <FileSignature size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-800">{contract.client.name}</h3>
                                            {contract.policy_no ? (
                                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                                    #{contract.policy_no}
                                                </span>
                                            ) : (
                                                <span className="font-mono text-xs font-bold text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                                                    #{contract.id.slice(0, 6)}...
                                                </span>
                                            )}
                                            <span className={clsx("px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap", status.bg, status.text)}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <span>{format(new Date(contract.sign_date), 'yyyy/MM/dd')}</span>
                                            <span>•</span>
                                            <span>{contract.duration_months}期</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {onTerminate && contract.status === 'active' && !getStatusInfo(contract).label.includes('已完成') && (
                                        <button
                                            onClick={(e) => handleAction(e, 'terminate', contract)}
                                            className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap"
                                        >
                                            提前終止
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={(e) => handleAction(e, 'delete', contract)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                            title="刪除"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                    <div className="text-right min-w-[80px]">
                                        <p className="font-bold text-slate-900">NT$ {contract.total_amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400">總保費</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirm}
                title={modalContent.title}
                message={modalContent.message}
                confirmText={modalContent.confirmText}
                isDestructive={modalContent.isDestructive}
                isLoading={confirmModal.isLoading}
            />
        </div>
    );
};
