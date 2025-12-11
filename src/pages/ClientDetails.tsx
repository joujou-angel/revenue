import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserCircle, Phone, FileText, Trash2, Edit } from 'lucide-react';
import { EditClientModal } from '../features/clients/components/EditClientModal';
import { useState } from 'react';
import { useClient } from '../features/clients';
import { useContracts, ContractList } from '../features/contracts';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

export const ClientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { client, loading: clientLoading, updateClient, deleteClient } = useClient(id);
    const { contracts, loading: contractsLoading, searchTerm, setSearchTerm, deleteContract, terminateContract } = useContracts(id);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    if (clientLoading) {
        return <div className="p-10 text-center text-slate-400">載入中...</div>;
    }

    if (!client) {
        return <div className="p-10 text-center text-slate-400">找不到該客戶</div>;
    }

    const handleDelete = () => {
        setIsDeleting(true);
    };

    const handleConfirmDelete = async () => {
        setIsProcessingDelete(true);
        const success = await deleteClient();
        setIsProcessingDelete(false);

        if (success) {
            navigate('/clients');
        } else {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-8 pb-24">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Link to="/clients" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={18} />
                        返回列表
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="編輯客戶"
                        >
                            <Edit size={20} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="刪除客戶"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-full w-fit h-fit">
                        <UserCircle size={40} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                            {/* Hidden Client ID as requested */}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-600">
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={18} className="text-slate-400" />
                                    <span>{client.phone}</span>
                                </div>
                            )}
                            {/* Separator if both exist */}
                            {client.phone && client.id_number && (
                                <span className="text-slate-300">|</span>
                            )}
                            {client.id_number && (
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-xs font-bold border border-slate-300 rounded px-1">ID</span>
                                    <span>{client.id_number}</span>
                                </div>
                            )}
                        </div>

                        {client.note && (
                            <div className="flex items-start gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl text-sm">
                                <FileText size={16} className="mt-0.5 shrink-0" />
                                <p>{client.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contracts List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    合約紀錄
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{contracts.length}</span>
                </h2>

                <ContractList
                    contracts={contracts}
                    loading={contractsLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onDelete={deleteContract}
                    onTerminate={terminateContract}
                />
            </div>
            <EditClientModal
                client={client}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={updateClient}
            />
            <ConfirmationModal
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleConfirmDelete}
                title="刪除客戶"
                message="確定要刪除此客戶嗎？此操作無法復原，且相關的合約與紀錄可能一併被刪除。"
                confirmText="確認刪除"
                isDestructive={true}
                isLoading={isProcessingDelete}
            />
        </div>
    );
};
