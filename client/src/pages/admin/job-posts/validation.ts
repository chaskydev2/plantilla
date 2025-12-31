
export const jobPostValidation = async (values: any) => {
  const errors: any = {};
  if (!values.homeowner_id) errors.homeowner_id = { type: 'required', message: 'Homeowner ID is required' };
  if (!values.title) errors.title = { type: 'required', message: 'Title is required' };
  if (!values.description) errors.description = { type: 'required', message: 'Description is required' };
  return { values, errors };
};
