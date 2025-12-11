import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContracts, ContractList } from '../features/contracts';

export const Contracts: React.FC = () => {
    const { contracts, loading, searchTerm, setSearchTerm, deleteContract, terminateContract } = useContracts();

    return (
        <div className="p-6 space-y-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">合約管理</h1>
                    <p className="text-sm text-slate-500">共 {contracts.length} 筆合約</p>
                </div>
                <Link
                    to="/contracts/new"
                    className="p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={20} />
                </Link>
            </div>

            <ContractList
                contracts={contracts}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onDelete={deleteContract}
                onTerminate={terminateContract}
            />
        </div>
    );
};
