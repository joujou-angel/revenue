import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export type Client = {
    id: string;
    name: string;
    phone: string | null;
    note: string | null;
    id_number: string | null;
    created_at: string;
};

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClients = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(searchTerm))
    );

    return {
        clients: filteredClients,
        loading,
        searchTerm,
        setSearchTerm,
        refresh: fetchClients
    };
};
