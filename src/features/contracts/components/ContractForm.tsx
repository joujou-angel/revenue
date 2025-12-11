import React from 'react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContractForm } from '../hooks/useContractForm';
import { LivePreview } from './LivePreview';

export const ContractForm: React.FC = () => {
    const navigate = useNavigate();
    const {
        loading,
        clients,
        formState,
        previewState,
        actions
    } = useContractForm();

    const {
        clientId, setClientId,
        policyNo, setPolicyNo,
        signDate, setSignDate,
        amount, setAmount,
        rate, setRate,
        duration, setDuration,
        penalty, setPenalty
    } = formState;

    const { previews, totalCommission } = previewState;
    const { handleSubmit, handleCreateMockClient } = actions;

    return (
        <div className="p-6 pb-24 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">新增合約</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Client Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">客戶</label>
                    <div className="flex gap-2">
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- 請選擇客戶 --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {/* Simple Add Client Trigger */}
                        <button
                            type="button"
                            onClick={handleCreateMockClient}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:scale-95 transition-transform"
                            title="快速建立假客戶"
                        >
                            <UserPlus size={20} />
                        </button>
                    </div>
                </div>

                {/* Contract No */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">合約編號</label>
                    <input
                        type="text"
                        value={policyNo}
                        onChange={(e) => setPolicyNo(e.target.value)}
                        placeholder="請輸入合約編號 (Policy No)"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Contract Config */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">簽約日期</label>
                        <input
                            type="date"
                            value={signDate}
                            onChange={(e) => setSignDate(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">期數 (月)</label>
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                            {[6, 12].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setDuration(m as 6 | 12)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${duration === m ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}
                                >
                                    {m}期
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">合約總金額 (保費)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">報酬率</label>
                        <input
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">違約金</label>
                        <input
                            type="number"
                            value={penalty}
                            onChange={(e) => setPenalty(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                    </div>
                </div>

                {/* Live Preview Section */}
                <LivePreview
                    previews={previews}
                    totalCommission={totalCommission}
                    duration={duration}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    {loading ? '處理中...' : (
                        <>
                            <Save size={20} /> 建立合約
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
