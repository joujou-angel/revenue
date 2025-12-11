import React from 'react';
import { CheckCircle2, Banknote, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useDashboardStats } from '../features/dashboard/hooks/useDashboardStats';
import { StatsCard } from '../features/dashboard/components/StatsCard';
import { PendingStampIcon } from '../components/icons/PendingStampIcon';

import { LogOut } from 'lucide-react';
import { BrandLogo } from '../components/icons/BrandLogo';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { stats, recentInstallments, loading } = useDashboardStats();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const kpiCards = [
        { label: '本月預計發出', value: `NT$ ${stats.thisMonthIncome.toLocaleString()}`, icon: PendingStampIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: '本月已發出', value: `NT$ ${stats.thisMonthPaid.toLocaleString()}`, icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: '活躍合約數', value: stats.activeContracts, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    if (loading) {
        return <div className="p-6 flex justify-center text-slate-400">載入中...</div>;
    }

    return (
        <div className="p-6 space-y-8 pb-24 bg-white min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <BrandLogo className="w-14 h-14" />
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight leading-none">Revenue</h1>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">你最專業的投資好朋友</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">WELCOME</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Quick Actions */}
            <Link to="/contracts/new" className="block w-full py-3 bg-slate-900 text-white rounded-xl text-center font-bold shadow-lg shadow-slate-200 active:scale-95 transition-transform">
                + 新增合約
            </Link>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 gap-4">
                {kpiCards.map((stat, index) => (
                    <StatsCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bg={stat.bg}
                    />
                ))}
            </section>

            {/* Recent Payments */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">近期待付</h2>
                    <Link to="/installments" className="text-sm text-blue-600 font-medium">查看全部</Link>
                </div>
                <div className="space-y-3">
                    {recentInstallments.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">目前沒有待發放款項</p>
                    ) : (
                        recentInstallments.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-sm text-slate-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{item.contract?.client?.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {format(new Date(item.due_date), 'yyyy/MM/dd')} • 第 {item.period_number} 期
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">NT$ {item.amount.toLocaleString()}</p>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-600">
                                        未發放
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

