import React from 'react';

export const PendingStampIcon: React.FC<{ size?: number | string, className?: string }> = ({ size = 24, className }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Stamp Circle Border */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />

            {/* Text '待' (Dai - Pending/Wait) */}
            <text
                x="50"
                y="65"
                textAnchor="middle"
                fill="currentColor"
                fontSize="50"
                fontWeight="bold"
                fontFamily="sans-serif, 'Microsoft JhengHei', 'PingFang TC'"
                style={{ userSelect: 'none' }}
            >
                待
            </text>
        </svg>
    );
};
