import { Gift, Zap, Edit } from 'lucide-react';
import type { Reward } from '../hooks/useAgentRewards';

interface RewardListProps {
    rewards: Reward[];
    loading: boolean;
    onEdit: (reward: Reward) => void;
}

export const RewardList: React.FC<RewardListProps> = ({ rewards, loading, onEdit }) => {
    if (loading) return <div className="text-center py-10 text-slate-400">載入中...</div>;

    if (rewards.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50 rounded-xl text-slate-400">
                尚未有任何佣金紀錄。
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {rewards.map((reward) => {
                const contractNo = reward.contract?.policy_no;
                const contractId = reward.contract_id || (reward.contract as any)?.id; // Try to find ID
                const displayId = contractNo ? `#${contractNo}` : (contractId ? `#${contractId.slice(0, 6)}...` : '');

                console.log('Reward Item:', { id: reward.id, contractNo, contractId, displayId, reward });

                return (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${reward.type === 'automatic' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                                {reward.type === 'automatic' ? <Zap size={20} /> : <Gift size={20} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-slate-800">{reward.description}</p>
                                    {displayId && (
                                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${contractNo ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                                            {displayId}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">
                                    {reward.date}
                                    {reward.contract?.client?.name && <span className="mx-1">• {reward.contract.client.name}</span>}
                                    <span className="mx-1">•</span>
                                    {reward.type === 'automatic' ? '自動計算' : '手動獎金'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-mono font-bold text-slate-900 text-lg">
                                +${reward.amount.toLocaleString()}
                            </p>
                            <button
                                onClick={() => onEdit(reward)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                title="編輯"
                            >
                                <Edit size={18} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
