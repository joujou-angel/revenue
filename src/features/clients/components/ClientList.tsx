import React, { useState } from 'react';
import { Search, UserCircle, Users, UserCheck, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Client } from '../hooks/useClients';

interface ClientListProps {
    clients: Client[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (val: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, loading, searchTerm, onSearchChange }) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'prospective'>('all');

    const filteredList = clients.filter(client => {
        if (filter === 'active') {
            return client.contracts?.some(c => c.status === 'active');
        }
        if (filter === 'prospective') {
            // No active contracts means prospective
            return !client.contracts?.some(c => c.status === 'active');
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Users size={16} />
                    全部客戶
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'active'
                            ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <UserCheck size={16} />
                    活躍客戶
                </button>
                <button
                    onClick={() => setFilter('prospective')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'prospective'
                            ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <UserPlus size={16} />
                    待開發
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="搜尋客戶姓名或電話..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10 text-slate-400">載入中...</div>
            ) : filteredList.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                    <p>
                        {searchTerm
                            ? '找不到符合搜尋的客戶'
                            : filter === 'active'
                                ? '目前沒有活躍客戶'
                                : filter === 'prospective'
                                    ? '目前沒有待開發客戶'
                                    : '暫無客戶資料'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredList.map((client) => {
                        const hasActiveContract = client.contracts?.some(c => c.status === 'active');

                        return (
                            <Link
                                to={`/clients/${client.id}`}
                                key={client.id}
                                className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow block group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full shrink-0 ${hasActiveContract
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <UserCircle size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-bold text-slate-800 truncate">{client.name}</h3>
                                            {hasActiveContract && (
                                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold">
                                                    ACTIVE
                                                </span>
                                            )}
                                        </div>
                                        {client.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                                                {client.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
