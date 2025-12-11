import React, { useState } from 'react';
import { useInstallments, MonthGroup, groupInstallmentsByMonth } from '../features/installments';

export const Installments: React.FC = () => {
    const { installments, loading, toggleStatus } = useInstallments();
    const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');

    const filteredData = viewMode === 'pending'
        ? installments.filter(i => i.status === 'pending')
        : installments;

    const groupedData = groupInstallmentsByMonth(filteredData);

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">帳務明細</h1>
                        <p className="text-xs text-slate-500">
                            {viewMode === 'pending' ? '待發放項目' : '全部歷史紀錄'}
                            <span className="ml-2 bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">共 {filteredData.length} 筆</span>
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        未發放
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        全部紀錄
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-10 text-slate-400">載入中...</div>
            ) : (
                <div className="space-y-8">
                    {groupedData.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                            <p>沒有符合的帳務資料</p>
                        </div>
                    ) : (
                        groupedData.map((group) => (
                            <MonthGroup
                                key={group.monthLabel}
                                group={group}
                                onToggleItem={toggleStatus}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
