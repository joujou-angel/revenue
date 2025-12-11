import React, { useState } from 'react';
import { ArrowLeft, PiggyBank, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgentRewards, type Reward } from '../features/agent-rewards/hooks/useAgentRewards';
import { RewardList } from '../features/agent-rewards/components/RewardList';
import { AddRewardModal } from '../features/agent-rewards/components/AddRewardModal';
import { EditRewardModal } from '../features/agent-rewards/components/EditRewardModal';

export const AgentRewards: React.FC = () => {
    const navigate = useNavigate();
    const { rewards, loading, stats, addManualReward, updateReward } = useAgentRewards();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);

    return (
        <div className="p-6 pb-24 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">業務佣金</h1>
            </div>

            {/* Total Stats Card */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-indigo-100 mb-1">累積總收入</p>
                        <h2 className="text-3xl font-bold">NT$ {stats.total.toLocaleString()}</h2>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <PiggyBank size={24} className="text-white" />
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 flex gap-4">
                    <div>
                        <p className="text-xs text-indigo-200">本月收入</p>
                        <p className="font-bold">+${stats.thisMonth.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">收入明細</h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                    <Plus size={16} /> 新增獎金
                </button>
            </div>

            {/* List */}
            <RewardList
                rewards={rewards}
                loading={loading}
                onEdit={setEditingReward}
            />

            {/* Add Modal */}
            <AddRewardModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addManualReward}
            />

            {/* Edit Modal */}
            <EditRewardModal
                reward={editingReward}
                isOpen={!!editingReward}
                onClose={() => setEditingReward(null)}
                onSave={updateReward}
            />
        </div>
    );
};
