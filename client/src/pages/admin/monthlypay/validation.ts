import * as yup from "yup";

type PaymentStoreFormValues = {
  payment_type: string;
  amount: number;
  date?: string;
  observation?: string;
  payment_method: string;
  user_ids: string[];
};

type PaymentUpdateFormValues = {
  payment_type: string;
  amount: number;
  date?: string;
  observation?: string;
  payment_method: string;
  user_id: string;
};

export const paymentStoreSchema: yup.ObjectSchema<PaymentStoreFormValues> = yup
  .object()
  .shape({
    payment_type: yup
      .string()
      .required("El tipo de pago es requerido")
      .defined(),

    amount: yup
      .number()
      .positive("El importe debe ser positivo")
      .required("El importe es requerido")
      .typeError("Debe ser un número válido"),

    date: yup.string().when("payment_type", {
      is: (value: string) => value === "1",
      then: (schema) =>
        schema
          .required("El mes es requerido para mensualidades")
          .matches(/^\d{4}-\d{2}$/, "Formato de mes inválido (YYYY-MM)"),
      otherwise: (schema) => schema.notRequired(),
    }),

    observation: yup
      .string()
      .optional()
      .max(500, "La observación no puede exceder los 500 caracteres"),

    payment_method: yup.string().required("El método de pago es requerido"),

    user_ids: yup
      .array()
      .of(yup.string().required())
      .min(1, "Debe seleccionar al menos un afiliado")
      .required("Debe seleccionar al menos un afiliado"),
  });

export const paymentUpdateSchema: yup.ObjectSchema<PaymentUpdateFormValues> =
  yup.object().shape({
    payment_type: yup
      .string()
      .required("El tipo de pago es requerido")
      .defined(),

    amount: yup
      .number()
      .positive("El importe debe ser positivo")
      .required("El importe es requerido")
      .typeError("Debe ser un número válido"),

    date: yup.string().when("payment_type", {
      is: (value: string) => value === "1",
      then: (schema) =>
        schema
          .required("El mes es requerido para mensualidades")
          .matches(/^\d{4}-\d{2}$/, "Formato de mes inválido (YYYY-MM)"),
      otherwise: (schema) => schema.notRequired(),
    }),

    observation: yup
      .string()
      .optional()
      .max(500, "La observación no puede exceder los 500 caracteres"),

    payment_method: yup.string().required("El método de pago es requerido"),

    user_id: yup.string().required("El afiliado es requerido"),
  });
