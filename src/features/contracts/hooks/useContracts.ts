import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export type Contract = {
    id: string;
    policy_no: string | null;
    sign_date: string;
    total_amount: number;
    commission_rate: number;
    duration_months: number;
    status: 'active' | 'terminated' | 'completed';
    client: {
        name: string;
    };
};

export const useContracts = (clientId?: string) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchContracts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('contracts')
                .select(`
                    *,
                    client:clients ( name )
                `)
                .order('sign_date', { ascending: false });

            if (clientId) {
                query = query.eq('client_id', clientId);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                // Ensure type safety manually or let it infer
                setContracts(data as unknown as Contract[]);
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [clientId]);

    const deleteContract = async (id: string) => {
        // Warning: This should probably cascade delete installments/rewards on DB side or here.
        // Assuming DB has ON DELETE CASCADE or user understands risks.
        // Actually, let's try to delete. If FK error, we alert.
        const { error } = await supabase
            .from('contracts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting contract:', error);
            alert('刪除失敗: 請確認是否有相關款項或佣金紀錄未刪除 (或是資料庫關聯限制)。');
            return false;
        }

        fetchContracts();
        return true;
    };

    const terminateContract = async (id: string) => {
        console.log('terminateContract called for id:', id);
        const { data, error } = await supabase
            .from('contracts')
            .update({ status: 'terminated' })
            .eq('id', id)
            .select();

        console.log('Supabase update result:', { data, error });

        if (error) {
            console.error('Error terminating contract:', error);
            alert('終止失敗: ' + error.message);
            return false;
        }

        fetchContracts();
        return true;
    };

    const filteredContracts = contracts.filter(contract =>
        contract.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contract.policy_no && contract.policy_no.includes(searchTerm))
    );

    return {
        contracts: filteredContracts,
        loading,
        searchTerm,
        setSearchTerm,
        refresh: fetchContracts,
        deleteContract,
        terminateContract
    };
};
