import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Installment } from '../types';

export const useInstallments = () => {
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInstallments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('installments')
                .select(`
                  id,
                  period_number,
                  due_date,
                  amount,
                  status,
                  contract:contracts (
                    id,
                    policy_no,
                    client:clients ( name )
                  )
                `)
                .neq('status', 'cancelled')
                .order('due_date', { ascending: true });

            if (error) throw error;
            setInstallments((data as any) || []);
        } catch (err: any) {
            console.error('Error fetching installments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstallments();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';

        // Optimistic Update
        setInstallments(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus as 'pending' | 'paid' } : item
        ));

        const { error } = await supabase
            .from('installments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Update failed:', error);
            // Revert
            setInstallments(prev => prev.map(item =>
                item.id === id ? { ...item, status: currentStatus as 'pending' | 'paid' } : item
            ));
            alert('更新失敗，請重試');
        }
    };

    return {
        installments,
        loading,
        error,
        toggleStatus,
        refresh: fetchInstallments
    };
};
