import React from 'react';
import { LayoutDashboard, Users, FileText, DollarSign, PiggyBank } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: '總覽', path: '/' },
        { icon: Users, label: '客戶', path: '/clients' },
        { icon: FileText, label: '合約', path: '/contracts' },
        { icon: PiggyBank, label: '佣金', path: '/agent-rewards' },
        { icon: DollarSign, label: '帳務', path: '/installments' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <main className="w-full min-h-screen bg-white relative">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 safe-area-pb z-50">
                <div className="w-full mx-auto flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center gap-1 transition-colors",
                                    isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};
