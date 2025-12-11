import React from 'react';
import type { GroupedInstallments } from '../types';
import { InstallmentRow } from './InstallmentRow';

interface MonthGroupProps {
    group: GroupedInstallments;
    onToggleItem: (id: string, status: string) => void;
}

export const MonthGroup: React.FC<MonthGroupProps> = ({ group, onToggleItem }) => {
    return (
        <section className="space-y-3">
            {/* Month Header */}
            <div className="flex items-center gap-4 px-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    {group.monthLabel}
                </h2>
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    月計: ${group.totalAmount.toLocaleString()}
                </span>
            </div>

            {/* Table-like Rows */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {group.items.map((item) => (
                    <InstallmentRow
                        key={item.id}
                        item={item}
                        onToggle={onToggleItem}
                    />
                ))}
            </div>
        </section>
    );
};
