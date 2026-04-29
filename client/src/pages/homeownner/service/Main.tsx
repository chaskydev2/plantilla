import { useMemo, useState } from "react";
import { Search, Plus, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import Modal from "@/components/modal/Modal";
import { useResource } from "@/core/hooks/useResource";
import { toastify } from "@/core/utils/toastify";
import { HomeownerProfileServiceService as ItemService } from "@/core/services/homeowner/homeownerProfileService.service";
import type { IHomeownerServiceLink } from "@/core/types/IHomeownerService";
import type { IService } from "@/core/types/IService";
import { useAppSelector } from "@/hooks";
import HomeownerServiceForm from "./Form";

type DialogConfig = {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	variant: "primary" | "danger";
};

const resolveService = (item: IHomeownerServiceLink): IService => {
	if (item.service) return item.service;
	return {
		id: item.service_id ?? item.id ?? 0,
		name: item.name ?? "",
		slug: item.slug ?? "",
		icon: item.icon,
		image: item.image,
		description: item.description,
		created_at: item.created_at,
		updated_at: item.updated_at,
	};
};

export default function HomeownerServiceList() {
	const authUser = useAppSelector((state) => state.auth.user);
	const homeownerProfileId = useMemo(() => {
		const parsed = authUser?.id ? Number(authUser.id) : undefined;
		return Number.isFinite(parsed) ? parsed : undefined;
	}, [authUser?.id]);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
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
	} = useResource<IHomeownerServiceLink>({
		service: ItemService,
		resourceId: homeownerProfileId ?? 0,
		defaultSort: { key: "name", direction: "asc" },
		defaultPerPage: 10,
	});

	const columns = [
		{
			key: "id",
			header: "ID",
			render: (item: IHomeownerServiceLink) => {
				const svc = resolveService(item);
				return <div className="font-bold">{svc.id ?? "-"}</div>;
			},
			sortable: true,
		},
		{
			key: "name",
			header: "Name",
			render: (item: IHomeownerServiceLink) => {
				const svc = resolveService(item);
				return <div className="font-semibold">{svc.name || "-"}</div>;
			},
			sortable: true,
		},
		{
			key: "slug",
			header: "Slug",
			render: (item: IHomeownerServiceLink) => {
				const svc = resolveService(item);
				return (
					<span className="font-mono text-sm text-gray-600 dark:text-gray-300">{svc.slug || "-"}</span>
				);
			},
			sortable: true,
		},
		{
			key: "icon",
			header: "Icon",
			render: (item: IHomeownerServiceLink) => {
				const svc = resolveService(item);
				const src = svc.icon;
				if (!src) return <span className="text-gray-500">-</span>;
				const resolved = src.startsWith("http") ? src : `${import.meta.env.VITE_API_URL ?? ""}/${src}`;
				return (
					<div className="relative h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
						<img
							src={resolved}
							alt={svc.name || "icon"}
							className="h-full w-full object-contain"
							onError={(e) => {
								(e.currentTarget as HTMLImageElement).style.display = "none";
							}}
						/>
						<ImageIcon className="w-4 h-4 text-gray-400 absolute" />
					</div>
				);
			},
		},
		{
			key: "image",
			header: "Image",
			render: (item: IHomeownerServiceLink) => {
				const svc = resolveService(item);
				const src = svc.image;
				if (!src) return <span className="text-gray-500">-</span>;
				const resolved = src.startsWith("http") ? src : `${import.meta.env.VITE_API_URL ?? ""}/${src}`;
				return (
					<div className="relative h-12 w-16 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
						<img
							src={resolved}
							alt={svc.name || "image"}
							className="h-full w-full object-cover"
							onError={(e) => {
								(e.currentTarget as HTMLImageElement).style.display = "none";
							}}
						/>
						<ImageIcon className="w-4 h-4 text-gray-400 absolute" />
					</div>
				);
			},
		},
		{
			key: "created_at",
			header: "Linked at",
			render: (item: IHomeownerServiceLink) => {
				const created = item?.pivot?.created_at ?? item?.created_at;
				return (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{created ? new Date(created).toLocaleDateString() : "-"}
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

	const confirmDelete = (item: IHomeownerServiceLink) => {
		const svc = resolveService(item);
		const serviceId = svc.id;
		openDialog(
			"Confirm deletion",
			`Are you sure you want to unlink the service "${svc.name}"?`,
			() => handleDelete(serviceId),
			"danger"
		);
	};

	const handleDelete = async (serviceId?: number) => {
		if (!homeownerProfileId || !serviceId) return;
		setIsProcessing(true);
		try {
			const response = await ItemService.remove(homeownerProfileId, serviceId);
			toastify.success(response?.message || "Service removed");
			fetchItems();
		} catch (error: any) {
			toastify.error(error?.response?.data?.message || "Error removing service");
		} finally {
			setIsProcessing(false);
			closeDialog();
		}
	};

	const actions = [
		{
			label: "Remove",
			icon: <Trash2 className="w-4 h-4" />,
			onClick: (item: IHomeownerServiceLink) => confirmDelete(item),
			variant: "danger" as const,
			show: () => true,
		},
	];

	const renderToolbar = () => (
		<div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
			<div className="flex gap-2">
				<button
					className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-8 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
					onClick={() => setIsFormOpen(true)}
				>
					<Plus className="w-5 h-5" />
					Manage services
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
					placeholder="Search services..."
					className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
					value={searchInput}
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
		</div>
	);

	if (!homeownerProfileId) {
		return (
			<div className="p-6">
				<PageBreadcrumb pageTitle="Services" />
				<div className="rounded-xl bg-yellow-50 text-yellow-800 p-4 border border-yellow-200">
					We could not determine your homeowner profile. Please sign in again.
				</div>
			</div>
		);
	}

	return (
		<div>
			<PageBreadcrumb pageTitle="My Services" />
			<DataTable
				data={items as IHomeownerServiceLink[]}
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
					title="Manage services"
					size="md"
				>
					<HomeownerServiceForm
						showBreadcrumb={false}
						onClose={() => setIsFormOpen(false)}
						onSaved={() => {
							fetchItems();
							setIsFormOpen(false);
						}}
					/>
				</Modal>
		</div>
	);
}
