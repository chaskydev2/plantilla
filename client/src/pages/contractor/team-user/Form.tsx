import { useEffect, useState } from 'react';
import Modal from '@/components/modal/Modal';
import { toastify } from '@/core/utils/toastify';
import { searchContractorsByName, updateTeamMemberStatus } from '@/core/services/contractor/contractor.service';
import type { WithRelations } from './Main';

interface FormValues {
  member_user_id: string;
  company?: string;
  isValidated: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaderUserId: number | null;
  onCreated: () => void;
  member?: WithRelations | null;
}

interface SearchResult {
  id: number;
  name: string;
  email?: string;
}

function getUserIdFromLocalStorage(): number | null {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.user?.id ?? null;
  } catch {
    return null;
  }
}

const defaultValues: FormValues = {
  member_user_id: '',
  company: '',
  isValidated: false,
};

const TeamMemberForm = ({ isOpen, onClose, leaderUserId, onCreated, member }: Props) => {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(member);

  const resolvedLeaderId = leaderUserId ?? getUserIdFromLocalStorage();

  useEffect(() => {
    if (!isOpen) {
      setValues(defaultValues);
      setSearchTerm('');
      setSearchResults([]);
      setSubmitting(false);
      setSearching(false);
      return;
    }

    if (member) {
      const leaderName = member.leader?.user?.name || member.leader?.name || `User #${member.leader_user_id}`;
      const leaderEmail = member.leader?.user?.email || 'No email';
      setValues({
        member_user_id: String(member.member_user_id ?? ''),
        company: member.compania || member.leader?.company_name || '',
        isValidated: (member.status || '').toLowerCase() === 'active',
      });
      setSearchTerm(`${leaderName}${leaderEmail ? ` • ${leaderEmail}` : ''}`);
    } else {
      setValues(defaultValues);
      setSearchTerm('');
      setSearchResults([]);
      setSearching(false);
    }
  }, [isOpen, member]);

  useEffect(() => {
    if (isEditing) return;

    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      void handleSearch(trimmed);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = async (term: string) => {
    const query = term.trim();
    if (!query) return;
    setSearching(true);
    try {
      const res = await searchContractorsByName(query, 10);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      const mapped: SearchResult[] = list.map((candidate: any) => ({
        id: candidate?.user?.id ?? candidate?.id,
        name: candidate?.user?.name ?? candidate?.name ?? 'Unnamed',
        email: candidate?.user?.email ?? candidate?.email,
      }));
      setSearchResults(mapped);
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Unable to search contractors');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectOption = (raw: string) => {
    if (isEditing) return;

    setSearchTerm(raw);
    const idPart = raw.split(' - ')[0];
    if (idPart && !Number.isNaN(Number(idPart))) {
      setValues(prev => ({ ...prev, member_user_id: idPart }));
      return;
    }
    if (!Number.isNaN(Number(raw))) {
      setValues(prev => ({ ...prev, member_user_id: raw }));
      return;
    }
    setValues(prev => ({ ...prev, member_user_id: '' }));
  };

  const handleSubmit = async () => {
    if (!resolvedLeaderId) {
      toastify.error('Leader not found');
      return;
    }

    if (!values.member_user_id) {
      toastify.error(isEditing ? 'Unable to identify the team member' : 'Select a member before saving');
      return;
    }

    setSubmitting(true);
    try {
      await updateTeamMemberStatus(Number(values.member_user_id), {
        leader_user_id: resolvedLeaderId,
        status: values.isValidated ? 'active' : 'pending',
      });

      toastify.success('Team member status updated');
      onCreated();
      onClose();
      setValues(defaultValues);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Unable to update team member status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Team Member' : 'Add Team Member'}
      size="sm"
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        {isEditing ? (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Leader</label>
            <div className="input bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-500 flex items-center min-h-[2.75rem]">
              <span className="truncate">{searchTerm || 'No leader selected'}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update the validation status for this leader relationship below.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Search contractor
              </label>
              <div className="flex gap-2 items-center">
                <input
                  list="contractor-options"
                  className="input flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                  placeholder="Type at least two letters"
                  value={searchTerm}
                  onChange={(event) => handleSelectOption(event.target.value)}
                  disabled={submitting}
                />
                {searching && <span className="loading loading-spinner loading-sm self-center" />}
              </div>
              <datalist id="contractor-options">
                {searchResults.map((candidate) => {
                  const label = `${candidate.id} - ${candidate.name}${candidate.email ? ` (${candidate.email})` : ''}`;
                  return <option key={candidate.id} value={label} />;
                })}
              </datalist>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select a contractor to add them to your team.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="company-field">
                Company (optional)
              </label>
              <input
                id="company-field"
                className="input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                placeholder="Company name"
                value={values.company}
                onChange={(event) => setValues(prev => ({ ...prev, company: event.target.value }))}
                disabled={submitting}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Validated member</span>
          <label className="label cursor-pointer justify-start gap-3">
            <span className="label-text">Mark as validated</span>
            <input
              type="checkbox"
              className={`toggle ${values.isValidated ? 'toggle-success' : 'bg-white text-black dark:bg-gray-800 dark:text-gray-100'}`}
              checked={values.isValidated}
              onChange={(event) => setValues(prev => ({ ...prev, isValidated: event.target.checked }))}
              disabled={submitting}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isEditing
              ? 'Toggle the switch to mark this leader relationship as active or pending.'
              : 'Enable the switch to register the member with active status. Leave it off to keep them pending.'}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? isEditing
                ? 'Updating...'
                : 'Saving...'
              : isEditing
              ? 'Update'
              : 'Save'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamMemberForm;
