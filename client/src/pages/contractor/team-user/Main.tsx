import React, { useEffect, useState } from 'react';
import DataTable from '@/components/table/DataTable';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Search, Eye, Trash, Pencil } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getTeamByMember, deleteTeamMember } from '@/core/services/contractor/contractor.service';
import MemberDetailModal from './MemberDetailModal';
import TeamMemberForm from './Form';
import type { ITableColumn, ITableAction, ITableSort, ITableProps } from '@/core/types/ITable';
import type { IPagination } from '@/core/types/IApi';

// Lightweight typing based on ContractorTeamMember pivot
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

const resolveLeaderName = (item: WithRelations): string => {
  const raw = item as any;
  return (
    item.leader?.user?.name ||
    item.leader?.name ||
    raw?.leader_user?.name ||
    raw?.leader?.user_name ||
    raw?.leader_name ||
    `User #${item.leader_user_id}`
  );
};

const resolveLeaderEmail = (item: WithRelations): string => {
  const raw = item as any;
  return (
    item.leader?.user?.email ||
    raw?.leader_user?.email ||
    raw?.leader_email ||
    'No email'
  );
};

const resolveLeaderCompany = (item: WithRelations): string => {
  const raw = item as any;
  return (
    item.leader?.company_name ||
    raw?.leader_company ||
    item.compania ||
    '-'
  );
};

const resolveLeaderCity = (item: WithRelations): string => {
  const raw = item as any;
  return item.leader?.city || raw?.leader_city || '-';
};

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
  const [sort, setSort] = useState<ITableSort>({ key: 'leader_user_id', direction: 'asc' });
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    count: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 0,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewItem, setViewItem] = useState<WithRelations | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WithRelations | null>(null);

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
      if (selectedMember?.member_user_id === memberToDelete) {
        setIsEditOpen(false);
        setSelectedMember(null);
      }
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
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: WithRelations) => {
        setViewItem(item);
      },
      variant: 'secondary',
      show: () => true,
    },
    {
      label: 'Edit',
      icon: <Pencil className="w-4 h-4" />,
      onClick: (item: WithRelations) => {
        setViewItem(null);
        setSelectedMember(item);
        setIsEditOpen(true);
      },
      variant: 'secondary',
      show: () => true,
    },
    {
      label: 'Delete',
      icon: <Trash className="w-4 h-4" />,
      onClick: (item: WithRelations) => askDelete(item.member_user_id),
      variant: 'danger',
      show: () => true,
    },
  ];

  const columns: ITableColumn<WithRelations>[] = [
    {
      key: 'leader_user_id',
      header: 'Leader',
      render: (item: WithRelations) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {resolveLeaderName(item)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {resolveLeaderCompany(item)}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'leader_contact',
      header: 'Contact',
      render: (item: WithRelations) => (
        <div className="text-gray-900 dark:text-gray-100">
          <span>{resolveLeaderEmail(item)}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {resolveLeaderCity(item)}
          </span>
        </div>
      ),
      sortable: false,
    },
    {
      key: 'status',
      header: 'Status',
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
      header: 'Created',
      render: (item: WithRelations) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString('en-US', {
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
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search leader..."
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

  const normalizedSearch = searchInput.trim().toLowerCase();

  const filteredItems = normalizedSearch
    ? items.filter(item => {
        const name = resolveLeaderName(item).toLowerCase();
        const email = resolveLeaderEmail(item).toLowerCase();
        const company = resolveLeaderCompany(item).toLowerCase();
        const city = resolveLeaderCity(item).toLowerCase();
        return (
          name.includes(normalizedSearch) ||
          email.includes(normalizedSearch) ||
          company.includes(normalizedSearch) ||
          city.includes(normalizedSearch) ||
          String(item.leader_user_id).includes(normalizedSearch)
        );
      })
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
      <PageBreadcrumb pageTitle="My Team" />
      <DataTable<WithRelations> {...tableProps} />
      <TeamMemberForm
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedMember(null);
        }}
        leaderUserId={selectedMember?.leader_user_id ?? null}
        onCreated={fetchData}
        member={selectedMember}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Member"
        message="This action will remove the member from the team."
        confirmText="Delete"
        cancelText="Cancel"
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
