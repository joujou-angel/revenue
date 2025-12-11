import React from 'react';


interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bg: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, bg }) => {
    return (
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
};
