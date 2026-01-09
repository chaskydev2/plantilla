import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";

import useAuth from "@/core/hooks/useAuth";
import Form from "./Form";

// Simulación de datos tipo JobPost
export type JobPost = {
  id: number;
  homeowner_id: number;
  service_id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  price: number;
  currency: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state_code: string;
  postal_code: string;
  lat: number;
  lng: number;
  image_path: string;
  service?: { name: string };
  homeowner?: any;
};

export default function JobPostList() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<JobPost | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  // Cambia este valor por el homeowner_id real (puedes obtenerlo de props, contexto, etc.)
  const homeownerId = 1;

  useEffect(() => {
    fetch(`/api/job-posts/homeowner/${homeownerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobPosts(data.data);
      });
  }, [homeownerId]);

  const columns = [
    { key: "id", header: "ID", render: (item: JobPost) => <div>{item.id}</div>, sortable: true },
    { key: "title", header: "Título", render: (item: JobPost) => <div>{item.title}</div>, sortable: true },
    { key: "description", header: "Descripción", render: (item: JobPost) => <div>{item.description}</div>, sortable: true },
    { key: "service", header: "Servicio", render: (item: JobPost) => <div>{item.service?.name}</div>, sortable: true },
    { key: "deadline", header: "Fecha Límite", render: (item: JobPost) => <div>{item.deadline}</div>, sortable: true },
    { key: "status", header: "Estado", render: (item: JobPost) => <div>{item.status}</div>, sortable: true },
    { key: "price", header: "Precio", render: (item: JobPost) => <div>{item.price} {item.currency}</div>, sortable: true },
    { key: "address_line1", header: "Dirección", render: (item: JobPost) => <div>{item.address_line1} {item.address_line2}</div>, sortable: false },
    { key: "city", header: "Ciudad", render: (item: JobPost) => <div>{item.city}</div>, sortable: true },
    { key: "image_path", header: "Imagen", render: (item: JobPost) => <img src={item.image_path} alt={item.title} width={50} />, sortable: false },
  ];

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "primary" | "danger" = "primary"
  ) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleEdit = (item: JobPost) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: JobPost) => {
    openDialog(
      "Confirmar eliminación",
      `¿Seguro que deseas eliminar la publicación "${item.title}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: JobPost) => {
    setIsProcessing(true);
    // Aquí deberías llamar a tu servicio para eliminar el JobPost
    setTimeout(() => {
      toastify.success(`Publicación "${item.title}" eliminada`);
      setIsProcessing(false);
      closeDialog();
    }, 1000);
  };

  const actions = [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: JobPost) => handleEdit(item),
      variant: "primary" as const,
      show: (item: JobPost) => true,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: JobPost) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: JobPost) => true,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          {t("admin.common.add")}
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={t("admin.common.search")}
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          disabled
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Publicaciones Recibidas" />
      <DataTable
        data={jobPosts}
        columns={columns}
        actions={actions}
        loading={false}
        renderTopToolbar={renderToolbar}
      />
      <Form
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
        initialData={currentItem}
        load={() => {}}
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
          confirmText={dialogConfig.variant === "danger" ? t("admin.common.delete") : t("admin.common.restore")}
        />
      )}
    </div>
  );
}
