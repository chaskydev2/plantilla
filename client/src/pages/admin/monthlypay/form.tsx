import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/components/form-field";
import * as yup from 'yup';
import Modal from "@/components/modal/Modal";
import { FormProviderWrapper } from "@/composables/FormProviderWrapper";
import type {
  IPaymentCreateRequest as ICreateRequest,
  IPaymentUpdateRequest as IUpdateRequest,
  IPaymentResponse as IItemResponse,
  IPaymentResponse,
} from "@/core/types/IPayment";
import {
  paymentStoreSchema as storeSchema,
  paymentUpdateSchema as updateSchema,
} from "./validation";
import { PaymentService as ItemService } from "@/core/services/payment/payment.service";
import { toastify } from "@/core/utils/toastify";
import { useFormContext, useWatch } from "react-hook-form";
import QRCode from "react-qr-code";
import { useState } from "react";
import MultiSelectField from "@/components/form-field/MultiSelectField";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  users: IPaymentResponse[];
}

const paymentMethods = [
  { id: "cash", name: "Pago en efectivo" },
  { id: "qr", name: "Pago por QR" },
];

const paymentType = [
  { id: "1", name: "Pago de Mensualidad" },
  { id: "2", name: "Multar" },
  { id: "3", name: "Pago de Curso" },
  { id: "4", name: "Pago de Multa" },
  { id: "5", name: "Pago De Certificacion" },
  { id: "6", name: "Pago de Visacion de Planos" },
  { id: "7", name: "Otros Pago" },
];

const PaymentModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  users = [],
}: PaymentModalProps) => {
  const isEditing = !!initialData;
  type FormValues = ICreateRequest | IUpdateRequest;
  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        id: initialData.id,
        payment_type: initialData.payment_type || "1",
        amount: initialData.amount || 0,
        date:
          initialData.payment_month && initialData.payment_year
            ? `${initialData.payment_year}-${String(
                initialData.payment_month
              ).padStart(2, "0")}`
            : "",
        observation: initialData.observation || "",
        payment_method: initialData.payment_method || "",
        user_id: initialData.user_id || "",
      }
    : {
        payment_type: "1", // Pago de Mensualidad por defecto
        amount: 0,
        date: "",
        observation: "",
        payment_method: "",
        user_ids: [],
      };

  const validationSchema = (isEditing ? updateSchema : storeSchema) as yup.ObjectSchema<any>;


  const handleSubmit = async (data: FormValues) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null)
      );

      if (isEditing) {
        if ("password" in cleanData && !cleanData.password) {
          delete cleanData.password;
        }
        const response = await ItemService.update(
          initialData!.id,
          cleanData as IUpdateRequest
        );
        load();
        toastify.success(response.message || "Item actualizado");
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        load();
        toastify.success(response.message || "Item creado");
      }

      onClose();
    } catch (error: any) {
      toastify.error(
        error.response?.data?.message ||
          (isEditing ? "Error al actualizar" : "Error al crear")
      );
    }
  };

  const PaymentQR = () => {
    const { control } = useFormContext();
    const selectedPaymentMethod = useWatch({ control, name: "payment_method" });
    const [copySuccess, setCopySuccess] = useState("");

    const qrValue = "https://midominio.com/pago";

    if (selectedPaymentMethod !== "qr") return null;

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Pago QR",
            text: "Escanea o comparte este código QR para realizar el pago.",
            url: qrValue,
          });
          setCopySuccess("¡Compartido correctamente!");
        } catch (error) {
          setCopySuccess("Error al compartir.");
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(qrValue);
          setCopySuccess("URL copiada al portapapeles");
        } catch {
          setCopySuccess("Error al copiar al portapapeles");
        }
      } else {
        setCopySuccess("Tu navegador no soporta compartir ni copiar.");
      }

      setTimeout(() => setCopySuccess(""), 3000);
    };

    return (
      <div className="mt-6 flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
          Escanee el siguiente código QR para realizar el pago
        </p>

        <div className="p-3 bg-white rounded-md border border-gray-200 dark:border-gray-700 shadow-inner">
          <QRCode value={qrValue} size={160} bgColor="#ffffff" level="H" />
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleShare}
            className="w-full max-w-xs px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-95 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Compartir QR
          </button>

          {copySuccess && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {copySuccess}
            </div>
          )}
        </div>
      </div>
    );
  };

  const MonthYearInput = () => {
    const { control } = useFormContext();
    const selectedPaymentType = useWatch({ control, name: "payment_type" });

    if (selectedPaymentType !== "1") return null;

    return <InputField name="date" label="Mes" type="month" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Pago" : "Nuevo Pago"}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
        mode={isEditing ? "edit" : "create"}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-5">
            {isEditing ? (
              <SelectField
                label="Afiliado"
                name="user_id"
                options={users}
                valueKey="id"
                labelKey="name"
                disabled
              />
            ) : (
              <MultiSelectField
                label="Seleccionar Afiliado(s)"
                name="user_ids"
                options={users}
                valueKey="id"
                labelKey="name"
                isMulti
              />
            )}
          </div>

          <div className="md:col-span-2">
            <SelectField
              label="Seleccione el Tipo de Movimiento"
              name="payment_type"
              options={paymentType}
              valueKey="id"
              labelKey="name"
            />
          </div>
          <div className="md:col-span-1">
            <InputField
              name="amount"
              label="Importe individual"
              placeholder="0.00"
              type="number"
              step="any"
              inputMode="decimal"
            />
          </div>
          <div className="md:col-span-2">
            <MonthYearInput />
          </div>
          <div className="md:col-span-5">
            <TextAreaField
              name="observation"
              label="Observacion"
              placeholder="Ej: Observacion relevantes"
              rows={1}
            />
          </div>
          <div className="md:col-span-5">
            <SelectField
              label="Seleccionar Método de Pago"
              name="payment_method"
              options={paymentMethods}
              valueKey="id"
              labelKey="name"
            />
          </div>
          <div className="md:col-span-5">
            <PaymentQR />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default PaymentModal;
