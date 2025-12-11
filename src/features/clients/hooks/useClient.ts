import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Client } from './useClients';

export const useClient = (id: string | undefined) => {
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setClient(data);
            } catch (error) {
                console.error('Error fetching client:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    const updateClient = async (updates: Partial<Client>) => {
        if (!id) return false;
        try {
            const { error } = await supabase
                .from('clients')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            // Optimistic update or refetch
            setClient(prev => prev ? { ...prev, ...updates } : null);
            return true;
        } catch (error) {
            console.error('Error updating client:', error);
            return false;
        }
    };

    const deleteClient = async () => {
        if (!id) return false;
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting client:', error);
            // Likely foreign key constraint if they have contracts
            alert('刪除失敗：該客戶可能有相關合約紀錄，請先刪除合約。');
            return false;
        }
    };

    return { client, loading, updateClient, deleteClient };
};
