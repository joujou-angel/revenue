import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import type { Installment, GroupedInstallments } from './types';

export const groupInstallmentsByMonth = (installments: Installment[]): GroupedInstallments[] => {
    const groupedData: GroupedInstallments[] = [];
    installments.forEach(item => {
        const date = parseISO(item.due_date);
        const monthLabel = format(date, 'yyyy年 M月', { locale: zhTW });
        let group = groupedData.find(g => g.monthLabel === monthLabel);
        if (!group) {
            group = { monthLabel, totalAmount: 0, items: [] };
            groupedData.push(group);
        }
        group.items.push(item);
        group.totalAmount += item.amount;
    });
    return groupedData;
};
