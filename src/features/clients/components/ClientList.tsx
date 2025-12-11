import React from 'react';
import { Search, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Client } from '../hooks/useClients';

interface ClientListProps {
    clients: Client[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (val: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, loading, searchTerm, onSearchChange }) => {
    return (
        <div className="space-y-4">
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
            ) : clients.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                    <p>找不到符合的客戶</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                        <Link
                            to={`/clients/${client.id}`}
                            key={client.id}
                            className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                                    <UserCircle size={20} />
                                </div>
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800 truncate">{client.name}</h3>
                                    {client.phone && (
                                        <>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-sm text-slate-500 truncate font-mono">{client.phone}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
