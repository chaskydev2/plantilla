import * as yup from 'yup';

export const rolPermissionStoreSchema = yup.object().shape({
  permission: yup.string()
    .required('El permiso es requerido')
});