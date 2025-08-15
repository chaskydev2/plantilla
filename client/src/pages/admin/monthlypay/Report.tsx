import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Search, Filter, X, BarChart2 } from "lucide-react";
import { UserService } from "@/core/services/user/user.service";
import { SelectField } from "@/components/form-field";
import { PaymentService as ItemService } from "@/core/services/payment/payment.service";
import type { IUserResponse } from "@/core/types/IUser";

type ReportFilters = {
  user_id?: number | "";
  year?: number | "";
  month?: number | "";
  payment_type?: string;
  payment_method?: string;
};

export default function PaymentReportForm() {
  const methods = useForm<ReportFilters>({
    defaultValues: {
      user_id: "",
      year: "",
      month: "",
      payment_type: "",
      payment_method: "",
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const hasFilters = Object.values(watch()).some(
    (val) => val !== undefined && val !== ""
  );

  const onSubmit = async (data: ReportFilters) => {
    try {
      setIsLoading(true);
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      const blob = await ItemService.exportReport(filteredData);
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (error) {
      console.error("Error al exportar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    const res = await UserService.getAll();
    setUsers(res.data);
  };

  const resetFilters = () => {
    reset({
      user_id: "",
      year: "",
      month: "",
      payment_type: "",
      payment_method: "",
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const yearOptions = [
    { value: "", label: "Todos los años" },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: currentYear - i,
      label: String(currentYear - i),
    })),
  ];

  const monthOptions = [
    { value: "", label: "Todos los meses" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
    })),
  ];

  const paymentTypeOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "1", label: "Mensualidad" },
    { value: "2", label: "Multa" },
    { value: "3", label: "Curso" },
    { value: "4", label: "Certificación" },
    { value: "5", label: "Visación" },
    { value: "6", label: "Otros" },
  ];

  const paymentMethodOptions = [
    { value: "", label: "Todos los métodos" },
    { value: "cash", label: "Efectivo" },
    { value: "qr", label: "QR" },
  ];

  // Agregar opción "Todos" para usuarios
  const userOptions = [
    { value: "", label: "Todos los afiliados" },
    ...users.map(user => ({
      value: user.id,
      label: user.name,
    })),
  ];

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Reporte de Pagos
        </h2>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SelectField
              label="Afiliados"
              name="user_id"
              options={userOptions}
              placeholder="Seleccione afiliado"
            />

            <SelectField 
              label="Año" 
              name="year" 
              options={yearOptions} 
            />

            <SelectField 
              label="Mes" 
              name="month" 
              options={monthOptions} 
            />

            <SelectField
              label="Tipo de Pago"
              name="payment_type"
              options={paymentTypeOptions}
            />

            <SelectField
              label="Método de Pago"
              name="payment_method"
              options={paymentMethodOptions}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-colors"
            >
              {isLoading ? (
                <>
                  <Filter className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}