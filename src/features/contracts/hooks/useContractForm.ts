import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { addMonths, format } from 'date-fns';

export type InstallmentPreview = {
    date: string;
    amount: number;
    period: number;
};

export type Client = {
    id: string;
    name: string;
};

export const useContractForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);

    // Form State
    const [clientId, setClientId] = useState('');
    const [policyNo, setPolicyNo] = useState('');
    const [signDate, setSignDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [amount, setAmount] = useState<string>('');
    const [rate, setRate] = useState<string>('0.24');
    const [duration, setDuration] = useState<6 | 12>(6);
    const [penalty, setPenalty] = useState<string>('0');

    // Preview State
    const [previews, setPreviews] = useState<InstallmentPreview[]>([]);
    const [totalCommission, setTotalCommission] = useState(0);

    // Fetch Clients on mount
    useEffect(() => {
        const fetchClients = async () => {
            const { data } = await supabase.from('clients').select('id, name');
            if (data) setClients(data);
        };
        fetchClients();
    }, []);

    // Recalculate Logic (Penny Perfect)
    useEffect(() => {
        const totalAmt = parseFloat(amount) || 0;
        const commRate = parseFloat(rate) || 0;
        const _totalCommission = totalAmt * commRate;
        setTotalCommission(_totalCommission);

        if (_totalCommission <= 0) {
            setPreviews([]);
            return;
        }

        const monthlyBase = Math.floor((_totalCommission / duration) * 100) / 100;
        const newPreviews: InstallmentPreview[] = [];
        const startDate = new Date(signDate);

        for (let i = 1; i <= duration; i++) {
            let currentAmount = 0;
            if (i === duration) {
                // Tail adjustment
                currentAmount = _totalCommission - (monthlyBase * (duration - 1));
            } else {
                currentAmount = monthlyBase;
            }

            // Fix floating point issues for display
            currentAmount = Math.round(currentAmount * 100) / 100;

            newPreviews.push({
                period: i,
                date: format(addMonths(startDate, i), 'yyyy-MM-dd'),
                amount: currentAmount
            });
        }
        setPreviews(newPreviews);
    }, [amount, rate, duration, signDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) {
            alert('請選擇客戶');
            return;
        }
        setLoading(true);

        const { error } = await supabase.from('contracts').insert({
            client_id: clientId,
            policy_no: policyNo,
            sign_date: signDate,
            total_amount: parseFloat(amount),
            commission_rate: parseFloat(rate),
            duration_months: duration,
            termination_penalty: parseFloat(penalty),
            status: 'active'
        });

        setLoading(false);

        if (error) {
            console.error(error);
            alert('新增失敗: ' + error.message);
        } else {
            alert('合約已建立！分期表將自動生成。');
            navigate('/');
        }
    };

    const handleCreateMockClient = async () => {
        const mockName = `客戶-${Math.floor(Math.random() * 1000)}`;
        const { data, error } = await supabase.from('clients').insert({
            name: mockName,
            phone: '0912-345-678',
            id_number: 'A123456789', // Dummy ID
            note: '系統自動生成'
        }).select().single();

        if (error) {
            console.error(error);
            alert('建立假客戶失敗: ' + error.message);
        } else if (data) {
            setClients([...clients, data]);
            setClientId(data.id); // Auto select the new client
            alert(`已建立假客戶：${mockName}`);
        }
    };

    return {
        loading,
        clients,
        formState: {
            clientId, setClientId,
            policyNo, setPolicyNo,
            signDate, setSignDate,
            amount, setAmount,
            rate, setRate,
            duration, setDuration,
            penalty, setPenalty
        },
        previewState: {
            previews,
            totalCommission
        },
        actions: {
            handleSubmit,
            handleCreateMockClient
        }
    };
};
