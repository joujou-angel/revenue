import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContracts, ContractList } from '../features/contracts';

export const Contracts: React.FC = () => {
    const { contracts, loading, searchTerm, setSearchTerm, deleteContract, terminateContract } = useContracts();
    const [viewMode, setViewMode] = React.useState<'active' | 'all'>('active');

    const filteredContracts = viewMode === 'active'
        ? contracts.filter(c => c.status === 'active')
        : contracts;

    const displayedCount = filteredContracts.length;

    return (
        <div className="p-6 space-y-6 pb-24">
            {/* Header with Sticky Tabs */}
            <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm pb-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">合約管理</h1>
                        <p className="text-sm text-slate-500">
                            {viewMode === 'active' ? '進行中合約' : '所有歷史合約'}
                            <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs text-slate-600">
                                {displayedCount}
                            </span>
                        </p>
                    </div>
                    <Link
                        to="/contracts/new"
                        className="p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                        <Plus size={20} />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-200 rounded-xl">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        進行中
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        全部合約
                    </button>
                </div>
            </div>

            <ContractList
                contracts={filteredContracts}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onDelete={deleteContract}
                onTerminate={terminateContract}
            />
        </div>
    );
};
