import React from 'react';
import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IProfessionCreateRequest as ICreateRequest,
  IProfessionUpdateRequest as IUpdateRequest,
  IProfession as IItemResponse
} from '@/core/types/IProfession';
import { ProfessionService as ItemService } from '@/core/services/profession/profession.service';
import { toastify } from '@/core/utils/toastify';
import {
  ProfessionStoreSchema as storeSchema,
  ProfessionUpdateSchema as updateSchema
} from './validation';
import { Briefcase, Wrench, Hammer, Scissors, Truck, Tag, Image, User } from 'lucide-react';

interface ProfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
  mode?: 'create' | 'edit' | 'view';
}

const ProfessionModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
  mode = 'create'
}: ProfessionModalProps) => {
  const isEditing = mode === 'edit';
  const isViewing = mode === 'view';
  
  console.log("Debug - Form props:", { mode, initialData, isEditing, isViewing });

  type FormValues = (ICreateRequest | IUpdateRequest) & { icon?: string };

  const defaultValues: FormValues = (isEditing || isViewing)
    ? {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      icon: (initialData as any)?.icon || '',
      description: initialData?.description || '',
    }
    : {
      name: '',
      slug: '',
      icon: '',
      description: '',
    };
    
  console.log("Debug - defaultValues:", defaultValues);

  const handleSubmit = async (data: FormValues) => {
    // No submit en modo view
    if (isViewing) return;
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, cleanData as IUpdateRequest);
        toastify.success(response.message || 'Profession updated successfully');
        onClose();
        load();
      } else {
        const response = await ItemService.create(cleanData as ICreateRequest);
        toastify.success(response.message || 'Profession created successfully');
        onClose();
        load();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An error occurred while saving the profession';
      toastify.error(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewing ? 'View Profession' : isEditing ? 'Edit Profession' : 'New Profession'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <InputField
              name="name"
              label="Name"
              placeholder="Ex: Plumbing, Electricity, Carpentry"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <InputField
              name="slug"
              label="Slug (Friendly URL)"
              placeholder="Ex: plumbing, electricity, carpentry (auto-generated)"
              helperText="Auto-generated based on the name if left empty"
              readOnly={isViewing}
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Description (Optional)"
              placeholder="Briefly describe this profession..."
              rows={4}
              readOnly={isViewing}
            />
          </div>
          {/* Icon selector */}
          <div className="col-span-1">
            <label className="label mb-2">Icon</label>
            {/* IconSelector uses react-hook-form context (registered below) */}
            <IconSelector readOnly={isViewing} />
            <p className="text-xs text-gray-500 mt-2">Suggestion: pick an icon that represents the trade (e.g. Wrench for plumbing, Hammer for carpentry, Briefcase for general contractors, Truck for delivery/transport).</p>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ProfessionModal;

// Small component rendered inside the form to pick an icon and preview it
import { useFormContext } from 'react-hook-form';

const LocalIconOptions = [
    { id: 'briefcase', label: 'Briefcase', Icon: Briefcase },
    { id: 'wrench', label: 'Wrench', Icon: Wrench },
    { id: 'hammer', label: 'Hammer', Icon: Hammer },
    { id: 'scissors', label: 'Scissors', Icon: Scissors },
    { id: 'truck', label: 'Truck', Icon: Truck },
    { id: 'tag', label: 'Tag', Icon: Tag },
    { id: 'image', label: 'Image', Icon: Image },
    { id: 'user', label: 'User', Icon: User },
  ];

  type RemoteIcon = {
    id: string;
    label: string;
    // either a url to an image/svg or an inline svg string
    url?: string;
    svg?: string;
  };

  type IconItemLocal = {
    id: string;
    label: string;
    Icon: any;
    source: 'local';
  };

  type IconItemRemote = {
    id: string;
    label: string;
    url?: string;
    svg?: string;
    source: 'remote';
  };

  type IconItem = IconItemLocal | IconItemRemote;

  function IconSelector({ readOnly, apiEndpoint }: { readOnly?: boolean; apiEndpoint?: string }) {
    const { register, setValue, watch } = useFormContext();
    const current = watch('icon') as string | undefined;
    const [query, setQuery] = React.useState('');
    const [remoteIcons, setRemoteIcons] = React.useState<RemoteIcon[] | null>(null);
    const endpoint = apiEndpoint || '/api/icons';
    // react-icons dynamic selection state
    const [riLib, setRiLib] = React.useState('fa'); // default library prefix
    const [riName, setRiName] = React.useState(''); // icon component name e.g. FaBeer
    const [riPreview, setRiPreview] = React.useState<any>(null);

    React.useEffect(() => {
      let mounted = true;
      // Try to fetch remote icons; if it fails, we keep null and use local icons
      fetch(endpoint)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch icons');
          const data = await res.json();
          // Expecting data to be Array<{id,label,url?,svg?}>
          if (mounted) setRemoteIcons(Array.isArray(data) ? data : null);
        })
        .catch(() => {
          if (mounted) setRemoteIcons(null);
        });
      return () => {
        mounted = false;
      };
    }, [endpoint]);

    // helper to dynamically import a react-icons component by library prefix and name
    const loadReactIcon = React.useCallback(async (lib: string, name: string) => {
      if (!lib || !name) return null;
      try {
        // react-icons packages are like 'react-icons/fa', 'react-icons/hi'
        // library prefix mapping: user supplies 'fa' -> 'fa', 'hi' -> 'hi'
        const pkg = `react-icons/${lib}`;
        const mod = await import(/* webpackChunkName: "react-icons-[request]" */ pkg);
        const Comp = (mod as any)[name];
        return Comp || null;
      } catch (e) {
        return null;
      }
    }, []);

    // A small curated sample of react-icons to show as clickable examples (easy selection)
    const SampleReactIcons: { lib: string; name: string; label: string; id: string }[] = [
      { lib: 'fa', name: 'FaBeer', label: 'Beer', id: 'fa:FaBeer' },
      { lib: 'fa', name: 'FaUser', label: 'User', id: 'fa:FaUser' },
      { lib: 'hi', name: 'HiOutlineHome', label: 'Home', id: 'hi:HiOutlineHome' },
      { lib: 'hi', name: 'HiOutlineUser', label: 'User', id: 'hi:HiOutlineUser' },
      { lib: 'md', name: 'MdWork', label: 'Work', id: 'md:MdWork' },
      { lib: 'ai', name: 'AiOutlineShopping', label: 'Shopping', id: 'ai:AiOutlineShopping' },
      { lib: 'bs', name: 'BsFillHouseFill', label: 'House', id: 'bs:BsFillHouseFill' },
      { lib: 'bi', name: 'BiBriefcase', label: 'Briefcase', id: 'bi:BiBriefcase' },
      { lib: 'ri', name: 'RiCustomerService2Line', label: 'Support', id: 'ri:RiCustomerService2Line' },
      { lib: 'io', name: 'IoMdConstruct', label: 'Construct', id: 'io:IoMdConstruct' },
    ];

    const [loadedSamples, setLoadedSamples] = React.useState<Record<string, any>>({});

    const SampleButton: React.FC<{ lib: string; name: string; label: string; id: string }> = ({ lib, name, label, id }) => {
      const [Comp, setComp] = React.useState<any>(loadedSamples[id] || null);
      React.useEffect(() => {
        let mounted = true;
        if (!Comp) {
          loadReactIcon(lib, name).then(c => {
            if (mounted && c) {
              setComp(() => c);
              setLoadedSamples(prev => ({ ...prev, [id]: c }));
            }
          });
        }
        return () => { mounted = false; };
      }, [lib, name, id, Comp]);

      return (
        <button
          key={id}
          type="button"
          onClick={() => !readOnly && setValue('icon', `${lib}:${name}`)}
          className={`flex flex-col items-center p-2 rounded border ${current === `${lib}:${name}` ? 'border-primary bg-primary/10' : 'border-transparent hover:border-gray-300'}`}
          title={label}
        >
          <div className="w-6 h-6">
            {Comp ? <Comp className="w-6 h-6" /> : <div className="w-6 h-6 bg-gray-200" />}
          </div>
          <span className="text-xs mt-1">{label}</span>
        </button>
      );
    };

    // combined list: if remoteIcons available use them first, otherwise fallback to local
    const combined: IconItem[] = React.useMemo(() => {
      const remotes = remoteIcons || [];
      // Normalize remote icon shape to unify rendering
      const remoteNormalized: IconItemRemote[] = remotes.map(r => ({
        // prefix remote ids to avoid collisions with local/sample ids
        id: `remote:${r.id}`,
        label: r.label,
        url: r.url,
        svg: r.svg,
        source: 'remote',
      }));

      const localNormalized: IconItemLocal[] = LocalIconOptions.map(l => ({
        // prefix local ids so they don't collide with react-icons ids
        id: `local:${l.id}`,
        label: l.label,
        Icon: l.Icon,
        source: 'local',
      }));

      // If remote icons exist, prefer them but also include local ones for completeness
      return [...remoteNormalized, ...localNormalized];
    }, [remoteIcons]);

    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return combined;
      return combined.filter(i => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }, [combined, query]);

    return (
      <div>
        <input type="hidden" {...register('icon')} />
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-sm w-full"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 max-h-56 overflow-auto">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => !readOnly && setValue('icon', item.id)}
              className={`flex flex-col items-center p-2 rounded border ${current === item.id ? 'border-primary bg-primary/10' : 'border-transparent hover:border-gray-300'}`}
              aria-pressed={current === item.id}
              title={item.label}
            >
              <div className="w-6 h-6">
                {item.source === 'local' ? (
                  // local has Icon
                  <item.Icon className="w-6 h-6" />
                ) : item.source === 'remote' ? (
                  // remote may have url or svg
                  item.url ? (
                    <img src={item.url} alt={item.label} className="w-6 h-6 object-contain" />
                  ) : item.svg ? (
                    <span className="w-6 h-6 block" dangerouslySetInnerHTML={{ __html: item.svg }} />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200" />
                  )
                ) : (
                  <div className="w-6 h-6 bg-gray-200" />
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
          {/* Divider and react-icons picker */}
          <div className="col-span-4 mt-2 border-t pt-2">
            <div className="flex items-center gap-2 mb-2">
              <select value={riLib} onChange={(e) => setRiLib(e.target.value)} className="select select-sm w-32">
                <option value="fa">fa (FontAwesome)</option>
                <option value="hi">hi (Heroicons)</option>
                <option value="md">md (Material)</option>
                <option value="gi">gi (Game Icons)</option>
                <option value="ai">ai (Ant Design)</option>
                <option value="bs">bs (Bootstrap)</option>
                <option value="bi">bi (BoxIcons)</option>
                <option value="ci">ci (Circum)</option>
                <option value="ti">ti (Typicons)</option>
                <option value="io">io (Ionicons)</option>
                <option value="ri">ri (Remix Icon)</option>
                {/* add more prefixes as desired */}
              </select>
              <input type="text" placeholder="Icon component name (e.g. FaBeer)" value={riName} onChange={e => setRiName(e.target.value)} className="input input-sm w-full" />
              <button type="button" className="btn btn-sm" onClick={async () => {
                const Comp = await loadReactIcon(riLib, riName);
                setRiPreview(() => Comp);
              }}>Preview</button>
              <button type="button" className="btn btn-sm btn-primary" onClick={async () => {
                // when selecting, store a string marker so we can resolve it later: lib:name
                if (!riName) return;
                setValue('icon', `${riLib}:${riName}`);
              }} disabled={!riName}>Select</button>
            </div>
            {riPreview ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6">{
                  (() => {
                    const Comp = riPreview as any;
                    return Comp ? <Comp className="w-6 h-6" /> : null;
                  })()
                }</div>
                <div className="text-sm">Preview of {riLib}:{riName}</div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Or enter a react-icons component name and press Preview to load it dynamically.</div>
            )}
          </div>
            {/* Sample react-icons grid for easy selection */}
            <div className="col-span-4 mt-2">
              <label className="label mb-2">Quick picks</label>
              <div className="grid grid-cols-6 gap-2">
                {SampleReactIcons.map(si => <SampleButton key={si.id} {...si} />)}
              </div>
            </div>
        </div>
      </div>
    );
  }