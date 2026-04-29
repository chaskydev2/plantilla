import { useState } from "react";
import { Search, Plus, Trash2, RefreshCw, ShieldAlert, Pencil } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import Modal from "@/components/modal/Modal";
import { useResource } from "@/core/hooks/useResource";
import { toastify } from "@/core/utils/toastify";
import { ScamAlertService as ItemService } from "@/core/services/homeowner/scamAlert.service";
import type { IScamAlert } from "@/core/types/IScamAlert";
import ClaimForm from "./Form";

type DialogConfig = {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	variant: "primary" | "danger";
};

const formatCurrency = (value?: number | null) => {
	if (value === undefined || value === null) return "-";
	return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
};

const formatStates = (states?: string[] | string | null) => {
	if (!states) return "-";
	if (Array.isArray(states)) return states.join(", ");
	return states;
};

export default function ScamAlertList() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
		const [editingClaim, setEditingClaim] = useState<IScamAlert | null>(null);
	const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);

	const {
		items,
		loading,
		pagination,
		sort,
		searchInput,
		handlePageChange,
		handleSortChange,
		handleFilterChange,
		handleLimitChange,
		handleSearch,
		fetchItems,
	    } = useResource<IScamAlert>({
        service: ItemService,
        methodName: 'getMyHomeownerClaims',
        defaultSort: { key: "reported_at", direction: "desc" },
        defaultPerPage: 10,
    });
	const columns = [
		{
			key: "id",
			header: "ID",
			render: (item: IScamAlert) => <div className="font-bold">{item.id ?? "-"}</div>,
			sortable: true,
		},
		{
			key: "business_name",
			header: "Business",
			render: (item: IScamAlert) => (
				<div className="flex items-center gap-2 font-semibold">
					<ShieldAlert className="w-4 h-4 text-amber-500" />
					<span>{item.business_name || "-"}</span>
				</div>
			),
			sortable: true,
		},
		{
			key: "complaint_location",
			header: "Location",
			render: (item: IScamAlert) => (
				<div className="text-sm text-gray-700 dark:text-gray-300">
					{item.complaint_location || "-"}
				</div>
			),
		},
		{
			key: "operating_states",
			header: "Operating states",
			render: (item: IScamAlert) => (
				<div className="text-sm text-gray-700 dark:text-gray-300">{formatStates(item.operating_states)}</div>
			),
		},
		{
			key: "amount_in_dispute",
			header: "Amount in dispute",
			render: (item: IScamAlert) => (
				<div className="text-sm text-gray-800 dark:text-gray-100">{formatCurrency(item.amount_in_dispute)}</div>
			),
			sortable: true,
		},
		{
			key: "complaints_count",
			header: "Complaints",
			render: (item: IScamAlert) => <div className="text-center">{item.complaints_count ?? 1}</div>,
			sortable: true,
		},
		{
			key: "status",
			header: "Status",
			render: (item: IScamAlert) => {
				const variants: Record<string, string> = {
					active: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
					resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
					closed: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
				};
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-semibold ${variants[item.status] ?? variants.active}`}>
						{item.status}
					</span>
				);
			},
			sortable: true,
		},
		{
			key: "reported_at",
			header: "Reported at",
			render: (item: IScamAlert) => {
				const date = item.reported_at ? new Date(item.reported_at) : null;
				return (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{date ? date.toLocaleDateString() : "-"}
					</div>
				);
			},
			sortable: true,
		},
	];

	const openDialog = (
		title: string,
		message: string,
		onConfirm: () => void,
		variant: "primary" | "danger" = "primary"
	) => {
		setDialogConfig({ isOpen: true, title, message, onConfirm, variant });
	};

	const closeDialog = () => setDialogConfig(null);

	const confirmDelete = (item: IScamAlert) => {
		const claimId = item.id;
		openDialog(
			"Confirm deletion",
			`Are you sure you want to delete the claim for "${item.business_name}"?`,
			() => handleDelete(claimId),
			"danger"
		);
	};

	const handleDelete = async (claimId?: number) => {
		if (!claimId) return;
		setIsProcessing(true);
		try {
			const response = await ItemService.remove(claimId);
			toastify.success(response?.message || "Claim removed");
			fetchItems();
		} catch (error: any) {
			toastify.error(error?.response?.data?.message || "Error removing claim");
		} finally {
			setIsProcessing(false);
			closeDialog();
		}
	};

	const actions = [
		{
			label: "Edit",
			icon: <Pencil className="w-4 h-4" />,
			onClick: (item: IScamAlert) => {
				setEditingClaim(item);
				setIsFormOpen(true);
			},
			variant: "primary" as const,
			show: () => true,
		},
		{
			label: "Remove",
			icon: <Trash2 className="w-4 h-4" />,
			onClick: (item: IScamAlert) => confirmDelete(item),
			variant: "danger" as const,
			show: () => true,
		},
	];

	const renderToolbar = () => (
		<div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
			<div className="flex gap-2">
				<button
					className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-8 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
					onClick={() => {
						setEditingClaim(null);
						setIsFormOpen(true);
					}}
				>
					<Plus className="w-5 h-5" />
					New claim
				</button>
				<button
					className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 font-semibold flex items-center gap-2 rounded-xl py-3 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
					onClick={() => fetchItems()}
				>
					<RefreshCw className="w-4 h-4" />
					Refresh
				</button>
			</div>
			<div className="relative w-full sm:w-64">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
					<Search className="w-5 h-5" />
				</div>
				<input
					type="text"
					placeholder="Search claims..."
					className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
					value={searchInput}
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
		</div>
	);

	return (
		<div>
			<div className="flex items-center justify-between gap-4 mb-4">
				<PageBreadcrumb pageTitle="Claims" />
				<button
					className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-8 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
					onClick={() => {
						setEditingClaim(null);
						setIsFormOpen(true);
					}}
				>
					<Plus className="w-5 h-5" />
					New claim
				</button>
			</div>
			<DataTable
				data={items as IScamAlert[]}
				columns={columns}
				actions={actions}
				sort={sort}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
				onSearch={handleSearch}
				pagination={pagination}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				availableLimits={[5, 10, 20, 50]}
				loading={loading}
				renderTopToolbar={renderToolbar}
			/>

			{dialogConfig && (
				<ConfirmDialog
					isOpen={dialogConfig.isOpen}
					title={dialogConfig.title}
					message={dialogConfig.message}
					onConfirm={dialogConfig.onConfirm}
					onCancel={closeDialog}
					isProcessing={isProcessing}
					variant={dialogConfig.variant}
					confirmText={dialogConfig.variant === "danger" ? "Delete" : "Confirm"}
				/>
			)}

			<Modal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				title={editingClaim ? "Edit claim" : "New claim"}
				size="md"
			>
				<ClaimForm
					initialClaim={editingClaim}
					onClose={() => setIsFormOpen(false)}
					onSaved={() => {
						fetchItems();
						setIsFormOpen(false);
						setEditingClaim(null);
					}}
				/>
			</Modal>
		</div>
	);
}
