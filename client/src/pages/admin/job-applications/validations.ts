// Archivo para validaciones de formularios de job-applications
export const validateJobApplication = (data: { name?: string; [key: string]: any }) => {
  const errors: Record<string, string> = {};
  // Ejemplo de validación
  if (!data.name || data.name.trim() === "") {
    errors.name = "El nombre es obligatorio";
  }
  // Agrega más validaciones según los campos necesarios
  return errors;
};
