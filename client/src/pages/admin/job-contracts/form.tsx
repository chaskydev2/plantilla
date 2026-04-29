import React from 'react';
import { useForm } from 'react-hook-form';

export type JobContractFormValues = {
  job_post_id: number;
  contractor_id: number;
  start_date?: string;
  end_date?: string;
  status?: string;
};

export const JobContractForm: React.FC<{ onSubmit: (data: JobContractFormValues) => void; defaultValues?: Partial<JobContractFormValues>; loading?: boolean; }> = ({ onSubmit, defaultValues = {}, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobContractFormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Job Post ID</label>
      <input type="number" {...register('job_post_id', { required: true })} />
      {errors.job_post_id && <span>Required</span>}

      <label>Contractor ID</label>
      <input type="number" {...register('contractor_id', { required: true })} />
      {errors.contractor_id && <span>Required</span>}

      <label>Start Date</label>
      <input type="date" {...register('start_date')} />

      <label>End Date</label>
      <input type="date" {...register('end_date')} />

      <label>Status</label>
      <input type="text" {...register('status')} />

      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
};
