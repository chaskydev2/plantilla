import { useFormContext } from 'react-hook-form';
import Select from '@/components/form/Select';


interface ServiceSelectFieldProps {
  name?: string;
  options: Array<{ id: string; name: string }>;
  disabled?: boolean;
  loading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ServiceSelectField({ name, options, value, onChange, disabled, loading }: ServiceSelectFieldProps) {
  const form = useFormContext();
  // Si se pasa name, usar react-hook-form para controlar el valor
  let fieldValue = value;
  let fieldOnChange = onChange;
  if (form && name) {
    fieldValue = form.watch(name) || '';
    fieldOnChange = (val: string) => form.setValue(name, val);
  }
  return (
    <div>
      <label className="label mb-2">Service</label>
      <Select
        options={options.map(s => ({ value: s.id, label: s.name }))}
        placeholder={loading ? 'Loading...' : 'Select a service'}
        value={fieldValue}
        onChange={fieldOnChange ?? (() => {})}
        disabled={disabled}
      />
    </div>
  );
}