import * as Yup from 'yup';
// Basic validation schema for JobPost
const jobPostSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Price is required'),
  service_id: Yup.number().nullable(),
  deadline: Yup.string().nullable(),
  status: Yup.string().nullable(),
  currency: Yup.string().nullable(),
  address_line1: Yup.string().nullable(),
  address_line2: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state_code: Yup.string().nullable(),
  postal_code: Yup.string().nullable(),
  lat: Yup.number().nullable(),
  lng: Yup.number().nullable(),
  image: Yup.mixed().nullable(),
});



import { InputField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type { JobPost } from './Main';
import { createJobPost, updateJobPost } from '@/core/services/jobPost.service';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: JobPost | null;
  load: () => void;
}

const Form: React.FC<FormProps> = ({ isOpen, onClose, initialData, load }) => {
  const isEditing = !!initialData;

  const defaultValues = initialData
    ? {
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        service_id: initialData.service_id || '',
        deadline: initialData.deadline ? initialData.deadline.substring(0, 10) : '',
        status: initialData.status || '',
        currency: initialData.currency || '',
        address_line1: initialData.address_line1 || '',
        address_line2: initialData.address_line2 || '',
        city: initialData.city || '',
        state_code: initialData.state_code || '',
        postal_code: initialData.postal_code || '',
        lat: initialData.lat || '',
        lng: initialData.lng || '',
      }
    : {
        title: '',
        description: '',
        price: '',
        service_id: '',
        deadline: '',
        status: '',
        currency: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state_code: '',
        postal_code: '',
        lat: '',
        lng: '',
      };

  const handleSubmit = async (data: any) => {
    try {
      let res;
      if (initialData && initialData.id) {
        res = await updateJobPost(data, initialData);
      } else {
        res = await createJobPost(data, initialData);
      }
      console.log(res);
      if (res.ok) {
        load();
        onClose();
      } else {
        alert('Error saving the post');
      }
    } catch (err) {
      console.log(err);
      alert('Network error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Post' : 'New Post'}
      size="md"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        validationSchema={jobPostSchema}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField name="title" label="Title" required />
          </div>
          <div className="md:col-span-2">
            <InputField name="description" label="Description" type="textarea" required />
          </div>
          <div>
            <InputField name="price" label="Price" type="number" min={0} />
          </div>
          <div>
            <InputField name="service_id" label="Service (service_id)" type="number" />
          </div>
          <div>
            <InputField name="deadline" label="Deadline" type="date" />
          </div>
          <div>
            <InputField name="status" label="Status" />
          </div>
          <div>
            <InputField name="currency" label="Currency" />
          </div>
          <div>
            <InputField name="address_line1" label="Address Line 1" />
          </div>
          <div>
            <InputField name="address_line2" label="Address Line 2" />
          </div>
          <div>
            <InputField name="city" label="City" />
          </div>
          <div>
            <InputField name="state_code" label="State (state_code)" />
          </div>
          <div>
            <InputField name="postal_code" label="Postal Code" />
          </div>
          <div>
            <InputField name="lat" label="Latitude" type="number" step="any" />
          </div>
          <div>
            <InputField name="lng" label="Longitude" type="number" step="any" />
          </div>
          <div className="md:col-span-2">
            <InputField name="image" label="Image" type="file" accept=".jpg,.jpeg,.png" />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default Form;
