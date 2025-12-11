export type Installment = {
    id: string;
    contract: {
        id: string;
        client: {
            name: string;
        };
        policy_no: string;
    };
    period_number: number;
    due_date: string;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
};

export type GroupedInstallments = {
    monthLabel: string;
    totalAmount: number;
    items: Installment[];
};
