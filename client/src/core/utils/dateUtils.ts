import { parseISO, format } from 'date-fns';

export const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return '';

  const localDateString = dateString.replace('Z', '');
  
  const date = parseISO(localDateString);
  
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export const formatDateTime = (dateString: string) => {
  if (!dateString) return '';

  const localDateString = dateString.replace('Z', '');
  
  const date = parseISO(localDateString);
  
  return format(date, "dd/MM/yyyy HH:mm");
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const localDateString = dateString.replace('Z', '');
  
  const date = parseISO(localDateString);
  
  return format(date, "dd/MM/yyyy");
};