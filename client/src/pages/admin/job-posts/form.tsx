import React from 'react';
import { useForm } from 'react-hook-form';
import { jobPostValidation } from './validation';

export type JobPostFormValues = {
  homeowner_id: number;
  title: string;
  description: string;
  deadline?: string;
  status?: string;
};

export const JobPostForm: React.FC<{ onSubmit: (data: JobPostFormValues) => void; defaultValues?: Partial<JobPostFormValues>; loading?: boolean; }> = ({ onSubmit, defaultValues = {}, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobPostFormValues>({
    defaultValues,
    mode: 'onBlur',
    resolver: jobPostValidation,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Homeowner ID</label>
      <input type="number" {...register('homeowner_id', { required: true })} />
      {errors.homeowner_id && <span>Required</span>}

      <label>Title</label>
      <input type="text" {...register('title', { required: true })} />
      {errors.title && <span>Required</span>}

      <label>Description</label>
      <textarea {...register('description', { required: true })} />
      {errors.description && <span>Required</span>}

      <label>Deadline</label>
      <input type="date" {...register('deadline')} />

      <label>Status</label>
      <input type="text" {...register('status')} />

      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
};
