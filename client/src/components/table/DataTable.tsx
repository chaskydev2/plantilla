import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { ITableColumn, ITableProps } from '@/core/types/ITable';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = <T,>({
  data = [],
  columns = [],
  actions = [],
  filters = [],
  sort,
  onSortChange,
  onFilterChange,
  onSearch,
  pagination,
  onPageChange,
  onLimitChange,
  availableLimits,
  loading = false,
  title = '',
  showCheckboxes = false,
  onSelectionChange,
  renderTopToolbar,
  renderBottomToolbar,
  initialSelectedItems = [],
  rowIdentifier = 'id' as keyof T,
}: ITableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (showCheckboxes && initialSelectedItems)
      setSelectedItems(initialSelectedItems);
  }, [initialSelectedItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedItems = e.target.checked ? [...data] : [];
    setSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    const newSelectedItems = checked
      ? [...selectedItems, item]
      : selectedItems.filter(selected => selected[rowIdentifier] !== item[rowIdentifier]);
    setSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };

  const isItemSelected = (item: T): boolean => {
    return selectedItems.some(selected => selected[rowIdentifier] === item[rowIdentifier]);
  };

  const renderCellContent = (item: T, column: ITableColumn<T>) => {
    if (column.render) return column.render(item);
    // @ts-ignore
    return item[column.key] || '-';
  };

  return (
    <div className="shadow-md rounded-2xl bg-white dark:bg-gray-800 px-4 xl:px-8 xl:py-8 w-full">
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h2>
      )}

      <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        {renderTopToolbar ? (
          renderTopToolbar()
        ) : (
          <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
            {onSearch && (
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {filters?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="select select-bordered w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500"
              onChange={(e) => onFilterChange?.({ [filter.key]: e.target.value })}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-[600px] w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-900 dark:bg-gray-700 text-gray-200 dark:text-gray-100 ">
            <tr>
              {showCheckboxes && (
                <th className="px-4 py-3 w-12">
                  <div className="flex justify-center items-center">
                    <label className="sr-only">Seleccionar todos</label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success"
                      checked={selectedItems.length === data.length && data.length > 0}
                      onChange={handleSelectAll}
                      aria-label="Seleccionar todos los elementos"
                    />
                  </div>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-4 py-3 text-sm text-gray-200 dark:text-gray-300"
                >
                  {column.sortable ? (
                    <button
                      className="flex items-center gap-1"
                      onClick={() =>
                        onSortChange?.({
                          key: column.key,
                          direction:
                            sort?.key === column.key && sort.direction === 'asc'
                              ? 'desc'
                              : 'asc',
                        })
                      }
                    >
                      {column.header}
                      {sort?.key === column.key && (
                        <span>{sort.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  ) : (
                    <span>{column.header}</span>
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left px-4 py-3">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showCheckboxes ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                >
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showCheckboxes ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {data.map((item, index) => (
                  <motion.tr
                    key={typeof item[rowIdentifier] === 'string' || typeof item[rowIdentifier] === 'number'
                      ? item[rowIdentifier]
                      : String(item[rowIdentifier] ?? index)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {showCheckboxes && (
                      <td className="px-4 py-3 w-12">
                        <div className="flex justify-center items-center">
                          <label className="sr-only">Seleccionar este elemento</label>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-success"
                            checked={isItemSelected(item)}
                            onChange={(e) => handleSelectItem(item, e.target.checked)}
                            aria-label={`Seleccionar elemento ${item[rowIdentifier] || index}`}
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 text-sm"
                      >
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {actions.map((action, i) => {
                            const shouldShow = !action.show || action.show(item);
                            if (!shouldShow) return null;
                            return (
                              <button
                                title={action.label}
                                key={i}
                                onClick={() => action.onClick(item)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-colors ${action.variant === 'primary'
                                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                  }`}
                                type="button"
                              >
                                {action.icon}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row sm:justify-between">
        {renderBottomToolbar ? (
          renderBottomToolbar()
        ) : (
          <>
            <div className="flex items-center gap-4">
              {onLimitChange && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Mostrar:
                  </span>
                  <select
                    className="select select-bordered select-sm 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                    border border-gray-500 dark:border-gray-600
                    focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-600
                    transition-colors duration-300"
                    value={pagination?.per_page || 10}
                    onChange={(e) => {
                      onLimitChange(Number(e.target.value));
                      onPageChange?.(1);
                    }}
                  >
                    {(availableLimits || [10, 25, 50, 100]).map((limit) => (
                      <option key={limit} value={limit}>
                        {limit}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {pagination &&
                  `Mostrando ${pagination.per_page * (pagination.current_page - 1) + 1
                  } al ${Math.min(
                    pagination.per_page * pagination.current_page,
                    pagination.total
                  )} de ${pagination.total} registros`}
              </div>
            </div>

            {pagination && onPageChange && (
              <div className="inline-flex rounded-md shadow-sm select-none">
                <button
                  className="px-3 py-1 bg-white text-gray-900 rounded-l-md
                    hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  disabled={pagination.current_page === 1}
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.total_pages) },
                  (_, i) => {
                    const page = i + 1;
                    const isActive = pagination.current_page === page;
                    return (
                      <button
                        key={page}
                        className={`px-3 py-1 
                        ${isActive
                            ? 'bg-gray-600 text-white'
                            : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
                          }
                        border-l border-r
                        transition-colors duration-300`}
                        onClick={() => onPageChange(page)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
                <button
                  className="px-3 py-1 bg-white text-gray-900 rounded-r-md
                    hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;