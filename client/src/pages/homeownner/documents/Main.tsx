import React, { useEffect, useState } from "react";
import DataTable from "@/components/table/DataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Search, Eye } from "lucide-react";
import type { AttributeHomeowner as IItemResource } from "@/pages/admin/attribute-homeowner/types";
import type { ITableColumn, ITableAction, ITableSort, ITableProps } from "@/core/types/ITable";
import type { IPagination } from "@/core/types/IApi";
import { AttributeHomeownerService as ItemService } from "@/core/services/homeowner/attributeHomeowner.service";
import AttributeHomeownerModal from "./Form";

type WithRelations = IItemResource & {
	attribute?: { id?: number; name?: string } | null;
	homeowner?: { id?: number; user?: { id?: number; name?: string } | null } | null;
};

function getUserIdFromLocalStorage(): number | null {
	try {
		const userData = localStorage.getItem("user_data");
		if (!userData) return null;
		const parsed = JSON.parse(userData);
		return parsed.id || null;
	} catch {
		return null;
	}
}

const AttributeHomeownerList: React.FC = () => {
	const [items, setItems] = useState<WithRelations[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [sort, setSort] = useState<ITableSort>({ key: "id", direction: "asc" });
	const [pagination, setPagination] = useState<IPagination>({
		total: 0,
		count: 0,
		per_page: 10,
		current_page: 1,
		total_pages: 0,
	});

	const [viewFile, setViewFile] = useState<string | null>(null);
	const [viewItem, setViewItem] = useState<WithRelations | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			setIsProcessing(false);
			const userId = getUserIdFromLocalStorage();
			if (!userId) {
				setItems([]);
				setLoading(false);
				return;
			}

			const response = await ItemService.getByUser(userId);

			if (response?.success && response?.data) {
				const data = Array.isArray(response.data) ? response.data : [];
				setItems(data);

				if (response.meta?.pagination) {
					setPagination(response.meta.pagination);
				} else {
					setPagination((prev) => ({
						total: data.length,
						count: data.length,
						per_page: prev.per_page,
						current_page: 1,
						total_pages: Math.ceil(data.length / prev.per_page),
					}));
				}
			} else {
				setItems([]);
			}
		} catch (error) {
			console.error("Error fetching attribute homeowners:", error);
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const actions: ITableAction<WithRelations>[] = [
		{
			label: "View",
			icon: <Eye className="w-4 h-4" />,
			onClick: (item: WithRelations) => {
				if (item.value) {
					setViewFile(String(item.value));
					setViewItem(item);
				}
			},
			variant: "secondary",
			show: (item: WithRelations) => !!item.value,
		},
	];

	const columns: ITableColumn<WithRelations>[] = [
		{
			key: "id",
			header: "ID",
			render: (item: WithRelations) => (
				<div className="flex items-center gap-3">
					<div className="font-bold text-gray-700 dark:text-gray-300">{String(item.id)}</div>
				</div>
			),
			sortable: true,
		},
		{
			key: "homeowner_name",
			header: "Homeowner Name",
			render: (item: WithRelations) => (
				<div className="text-gray-900 dark:text-gray-100">
					{item.homeowner?.user?.name ?? "-"}
				</div>
			),
			sortable: false,
		},
		{
			key: "attribute_name",
			header: "Attribute Name",
			render: (item: WithRelations) => (
				<div className="text-gray-900 dark:text-gray-100">{item.attribute?.name ?? "-"}</div>
			),
			sortable: false,
		},
		{
			key: "created_at",
			header: "Created",
			render: (item: WithRelations) => (
				<div className="text-sm text-gray-600 dark:text-gray-400">
					{item.created_at
						? new Date(item.created_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})
						: "-"}
				</div>
			),
			sortable: true,
		},
		{
			key: "updated_at",
			header: "Updated",
			render: (item: WithRelations) => (
				<div className="text-sm text-gray-600 dark:text-gray-400">
					{item.updated_at
						? new Date(item.updated_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})
						: "-"}
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
					placeholder="Search..."
					className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-xl"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
			</div>
		</div>
	);

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({
			...prev,
			current_page: page,
		}));
	};

	const handleLimitChange = (limit: number) => {
		setPagination((prev) => ({
			...prev,
			per_page: limit,
			current_page: 1,
			total_pages: Math.ceil(prev.total / limit),
		}));
	};

	const tableProps: ITableProps<WithRelations> = {
		data: items,
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
			<PageBreadcrumb pageTitle="My Documents" />
			<DataTable<WithRelations> {...tableProps} />

			<AttributeHomeownerModal
				viewFile={viewFile}
				viewItem={viewItem}
				setViewFile={setViewFile}
				setViewItem={setViewItem}
				fetchItems={fetchData}
				isProcessing={isProcessing}
				setIsProcessing={setIsProcessing}
			/>
		</div>
	);
};

export default AttributeHomeownerList;
