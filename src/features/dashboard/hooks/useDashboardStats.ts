import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export type DashboardStats = {
    thisMonthIncome: number;
    thisMonthPaid: number;
    activeContracts: number;
};

export type RecentInstallment = {
    id: string;
    amount: number;
    due_date: string;
    period_number: number;
    status: string;
    contract: {
        id: string;
        client: {
            name: string;
        };
    };
};

export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats>({
        thisMonthIncome: 0,
        thisMonthPaid: 0,
        activeContracts: 0
    });
    const [recentInstallments, setRecentInstallments] = useState<RecentInstallment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Stats from View (Keep for other stats)
                const { data: statsData } = await supabase
                    .from('dashboard_stats')
                    .select('*')
                    .maybeSingle();

                // 2. Calculate "This Month Payout" manually to ensure logic
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

                const { data: monthData } = await supabase
                    .from('installments')
                    .select('amount, status')
                    .gte('due_date', startOfMonth)
                    .lte('due_date', endOfMonth)
                    .neq('status', 'cancelled');

                const thisMonthTotal = monthData?.reduce((sum, item) => sum + item.amount, 0) || 0;
                const thisMonthPaid = monthData?.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.amount, 0) || 0;

                // 3. Fetch Recent Installments
                const { data: recentData, error: recentError } = await supabase
                    .from('installments')
                    .select(`
                        id,
                        amount,
                        due_date,
                        period_number,
                        status,
                        contract:contracts (
                            id,
                            client:clients ( name )
                        )
                    `)
                    .eq('status', 'pending')
                    .order('due_date', { ascending: true })
                    .limit(3);

                if (recentError) console.error(recentError);

                setStats({
                    thisMonthIncome: thisMonthTotal,
                    thisMonthPaid: thisMonthPaid,
                    activeContracts: statsData?.active_contracts_count || 0
                });

                setRecentInstallments((recentData as any[]) || []);

            } catch (error) {
                console.error('Dashboard Load Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { stats, recentInstallments, loading };
};
