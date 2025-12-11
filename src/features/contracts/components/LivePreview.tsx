import React from 'react';
import { Calculator } from 'lucide-react';
import type { InstallmentPreview } from '../hooks/useContractForm';

interface LivePreviewProps {
    previews: InstallmentPreview[];
    totalCommission: number;
    duration: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ previews, totalCommission, duration }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg ring-1 ring-slate-900/5 space-y-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm uppercase tracking-wider font-semibold">
                <Calculator size={16} />
                分期預覽 (Live Calculation)
            </div>

            <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                    <p className="text-slate-500 text-sm">預估總報酬</p>
                    <p className="text-2xl font-bold text-emerald-600">NT$ {totalCommission.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-xs">每月約</p>
                    <p className="text-sm font-medium text-slate-600">NT$ {(totalCommission / duration).toFixed(0)}</p>
                </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {previews.map((item) => (
                    <div key={item.period} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded">
                        <span className="text-slate-400 w-8">#{item.period}</span>
                        <span className="text-slate-600 flex-1">{item.date}</span>
                        <span className="font-mono font-medium text-emerald-600">
                            ${item.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
