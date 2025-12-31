import React, { useEffect, useState } from 'react';
import DataTable from '@/components/table/DataTable';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Search, Eye, Plus, Trash } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getTeamByMember, deleteTeamMember } from '@/core/services/contractor/contractor.service';
import MemberDetailModal from './MemberDetailModal';
import type { ITableColumn, ITableAction, ITableSort, ITableProps } from '@/core/types/ITable';
import type { IPagination } from '@/core/types/IApi';
import TeamMemberForm from './Form';

// Tipado ligero basado en ContractorTeamMember pivot
export type ContractorTeamMember = {
  leader_user_id: number;
  member_user_id: number;
  status?: string | null;
  compania?: string | null;
  member?: {
    user?: { id?: number; name?: string; email?: string } | null;
    company_name?: string | null;
    service_area?: string | null;
    portfolio_url?: string | null;
    lat?: number | string | null;
    lng?: number | string | null;
  } | null;
  leader?: {
    user_id?: number | null;
    company_name?: string | null;
    city?: string | null;
    name?: string | null;
    service_area?: string | null;
    lat?: number | string | null;
    lng?: number | string | null;
    user?: { id?: number; name?: string; email?: string } | null;
  } | null;
  created_at?: string;
  updated_at?: string;
};

export type WithRelations = ContractorTeamMember;

function getUserIdFromLocalStorage(): number | null {
  try {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    return parsed.id || parsed.user?.id || null;
  } catch {
    return null;
  }
}

const ContractorTeam: React.FC = () => {
  const [items, setItems] = useState<WithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState<ITableSort>({ key: 'member_user_id', direction: 'asc' });
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    count: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewItem, setViewItem] = useState<WithRelations | null>(null);

  const askDelete = (memberUserId: number) => {
    if (!memberUserId) return;
    setMemberToDelete(memberUserId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      setDeleting(true);
      await deleteTeamMember(memberToDelete);
      await fetchData();
    } catch (error) {
      const err = error as any;
      console.error('deleteTeamMember:error', err);
      if (err?.response) {
        console.error('deleteTeamMember:status', err.response.status);
        console.error('deleteTeamMember:data', err.response.data);
      }
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  const fetchData = async () => {
    console.log('fetchData:start');
    setLoading(true);
    try {
      const userId = getUserIdFromLocalStorage();
      console.log('fetchData:userId', userId);
      if (!userId) {
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await getTeamByMember(userId);
        
      // Short-circuit when the API comes empty/undefined
      if (!response || (!Array.isArray(response?.data) && !Array.isArray(response?.data?.data))) {
        console.warn('getTeamByMember returned empty data for user', userId, response);
        setItems([]);
        setPagination(prev => ({
          total: 0,
          count: 0,
          per_page: prev.per_page,
          current_page: 1,
          total_pages: 0,
        }));
        return;
      }

      console.log('API Response:', response);
      const data = Array.isArray(response?.data) ? response.data : response?.data?.data || [];

      setItems(data as WithRelations[]);

      if (response?.meta?.pagination) {
        setPagination(response.meta.pagination);
      } else {
        setPagination(prev => ({
          total: data.length,
          count: data.length,
          per_page: prev.per_page,
          current_page: 1,
          total_pages: Math.ceil(data.length / prev.per_page || 1),
        }));
      }
    } catch (error) {
      // Log details to see why the API is not responding
      const err = error as any;
      console.error('fetchData:error', err);
      if (err?.response) {
        console.error('fetchData:error status', err.response.status);
        console.error('fetchData:error data', err.response.data);
      }
      setItems([]);
    } finally {
      console.log('fetchData:done');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect:mount -> fetchData');
    fetchData();
  }, []);

  const actions: ITableAction<WithRelations>[] = [
    {
      label: 'Ver',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: WithRelations) => {
        setViewItem(item);
      },
      variant: 'secondary',
      show: () => true,
    },
    {
      label: 'Eliminar',
      icon: <Trash className="w-4 h-4" />,
      onClick: (item: WithRelations) => askDelete(item.member_user_id),
      variant: 'danger',
      show: () => true,
    },
  ];

  const columns: ITableColumn<WithRelations>[] = [
    {
      key: 'leader_user_id',
      header: 'Líder',
      render: (item: WithRelations) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {item.leader?.name || item.leader?.user?.name || `Usuario #${item.leader_user_id}`}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.leader?.company_name || ''}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'member_user_id',
      header: 'Miembro',
      render: (item: WithRelations) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {item.member?.user?.name || `Usuario #${item.member_user_id}`}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.member?.user?.email || 'Sin email'}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'compania',
      header: 'Compañía',
      render: (item: WithRelations) => (
        <div className="text-gray-900 dark:text-gray-100">
          {item.compania || item.leader?.company_name || '-'}
          {item.leader?.city ? ` • ${item.leader.city}` : ''}
        </div>
      ),
      sortable: false,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item: WithRelations) => {
        const status = item.status || 'pending';
        const badge = status === 'active'
          ? 'badge-success'
          : status === 'inactive'
          ? 'badge-error'
          : 'badge-warning';
        return <span className={`badge ${badge}`}>{status}</span>;
      },
      sortable: true,
    },
    {
      key: 'created_at',
      header: 'Creado',
      render: (item: WithRelations) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '-'}
        </div>
      ),
      sortable: true,
    },
  ];

  const renderToolbar = (): React.ReactElement => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-6 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Agregar miembro
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-xl"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      current_page: page,
    }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({
      ...prev,
      per_page: limit,
      current_page: 1,
      total_pages: Math.ceil(prev.total / limit || 1),
    }));
  };

  const filteredItems = searchInput
    ? items.filter(item =>
        (item.member?.user?.name || '').toLowerCase().includes(searchInput.toLowerCase()) ||
        (item.member?.user?.email || '').toLowerCase().includes(searchInput.toLowerCase()) ||
        String(item.member_user_id).includes(searchInput)
      )
    : items;

  const tableProps: ITableProps<WithRelations> = {
    data: filteredItems,
    columns,
    actions,
    sort,
    onSortChange: setSort,
    onFilterChange: () => {},
    onSearch: setSearchInput,
    pagination,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
    loading,
    renderTopToolbar: renderToolbar,
    availableLimits: [10, 20, 50],
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Mi equipo" />
      <DataTable<WithRelations> {...tableProps} />
      <TeamMemberForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leaderUserId={getUserIdFromLocalStorage()}
        onCreated={fetchData}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar miembro"
        message="Esta acción quitará al miembro del equipo."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isProcessing={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setMemberToDelete(null);
        }}
      />
      <MemberDetailModal item={viewItem} onClose={() => setViewItem(null)} />
    </div>
  );
};

export default ContractorTeam;
