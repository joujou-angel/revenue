import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Installment } from '../types';

interface InstallmentRowProps {
    item: Installment;
    onToggle: (id: string, status: string) => void;
}

export const InstallmentRow: React.FC<InstallmentRowProps> = ({ item, onToggle }) => {
    const isPaid = item.status === 'paid';

    return (
        <div
            onClick={() => onToggle(item.id, item.status)}
            className={`
                group flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-slate-50
                ${isPaid ? 'bg-slate-50/50' : 'bg-white'}
            `}
        >
            {/* Checkbox */}
            <div className={`flex-shrink-0 transition-colors ${isPaid ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                {isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>

            {/* Status Badge (Moved here) */}
            <div className="flex-shrink-0">
                {isPaid ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">已發放</span>
                ) : (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">未發放</span>
                )}
            </div>

            {/* Main Row Content - Flex Row for ALL screens */}
            <div className="flex-1 flex flex-row items-center justify-between gap-2 md:gap-4 px-0 md:px-4 overflow-hidden">

                {/* Client Information */}
                <div className="w-[30%] md:w-[35%] min-w-0">
                    <p className={`font-bold text-sm md:text-lg truncate ${isPaid ? 'text-slate-400' : 'text-slate-900'}`}>
                        {item.contract?.client?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {item.contract?.policy_no ? `#${item.contract.policy_no}` : `#${item.contract?.id?.slice(0, 6)}...`}
                    </p>
                </div>

                {/* Date & Period */}
                <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 w-[35%] md:w-[35%]">
                    <span className={`text-xs md:text-base font-medium ${isPaid ? 'text-slate-400' : 'text-slate-700'}`}>
                        {format(parseISO(item.due_date), 'yyyy/MM/dd')}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded w-fit">
                        第 {item.period_number} 期
                    </span>
                </div>

                {/* Amount */}
                <div className="text-right w-[35%] md:w-[30%]">
                    <p className={`font-mono font-bold text-base md:text-lg ${isPaid ? 'text-slate-400' : 'text-slate-900'}`}>
                        ${item.amount.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};
