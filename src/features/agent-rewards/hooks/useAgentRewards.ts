import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export type Reward = {
    id: string;
    amount: number;
    date: string;
    description: string;
    type: 'automatic' | 'manual';
    contract_id?: string;
    contract?: {
        policy_no: string | null;
        client: {
            name: string;
        };
    };
};

export const useAgentRewards = () => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, thisMonth: 0 });

    const fetchRewards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('agent_rewards')
            .select(`
                *,
                contract:contracts (
                    policy_no,
                    client:clients ( name )
                )
            `)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching rewards:', error);
        } else if (data) {
            setRewards(data as Reward[]);

            // Calculate Stats
            const total = data.reduce((sum, item) => sum + Number(item.amount), 0);

            const now = new Date();
            const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const thisMonth = data
                .filter(item => item.date.startsWith(currentMonthStr))
                .reduce((sum, item) => sum + Number(item.amount), 0);

            setStats({ total, thisMonth });
        }
        setLoading(false);
    };

    const addManualReward = async (description: string, amount: number, date: string) => {
        const { error } = await supabase.from('agent_rewards').insert({
            description,
            amount,
            date,
            type: 'manual'
        });

        if (error) {
            alert('新增失敗: ' + error.message);
            return false;
        }

        await fetchRewards();
        return true;
    };

    const deleteReward = async (id: string) => {
        const { error } = await supabase
            .from('agent_rewards')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting reward:', error);
            alert('刪除失敗: ' + error.message);
            return false;
        }

        await fetchRewards();
        return true;
    };

    const updateReward = async (id: string, updates: Partial<Reward>) => {
        const { error } = await supabase
            .from('agent_rewards')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating reward:', error);
            alert('更新失敗: ' + error.message);
            return false;
        }

        await fetchRewards();
        return true;
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    return {
        rewards,
        loading,
        stats,
        addManualReward,
        deleteReward,
        updateReward,
        refresh: fetchRewards
    };
};
