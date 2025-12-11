import React from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClients, ClientList } from '../features/clients';

export const Clients: React.FC = () => {
    const { clients, loading, searchTerm, setSearchTerm } = useClients();

    return (
        <div className="p-6 space-y-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">客戶管理</h1>
                    <p className="text-sm text-slate-500">共 {clients.length} 位客戶</p>
                </div>
                {/* 
                  Future Todo: Implement Add Client Modal or Page. 
                  For now we link to New Contract which has a quick add, or just disable it 
                */}
                <Link
                    to="/contracts/new"
                    className="p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    <UserPlus size={20} />
                </Link>
            </div>

            <ClientList
                clients={clients}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
        </div>
    );
};
