import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, User, X } from 'lucide-react';
import { UserService } from '@/core/services/user/user.service';
import type { IUserResponse } from '@/core/types/IUser';

interface UserSearchFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const UserSearchField = ({ 
  name, 
  label, 
  placeholder = "Buscar usuario...", 
  required = false 
}: UserSearchFieldProps) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = watch(name);

  // Cargar usuarios cuando se hace búsqueda
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await UserService.getAllPaginated({
          search: searchTerm,
          per_page: 10
        });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar usuario seleccionado si ya hay un valor
  useEffect(() => {
    const loadSelectedUser = async () => {
      if (currentValue && !selectedUser) {
        try {
          const response = await UserService.get(currentValue);
          setSelectedUser(response.data);
          setSearchTerm(`${response.data.first_name} ${response.data.last_name}`);
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
    };

    loadSelectedUser();
  }, [currentValue, selectedUser]);

  const handleSelectUser = (user: IUserResponse) => {
    setSelectedUser(user);
    setValue(name, user.id);
    setSearchTerm(`${user.first_name} ${user.last_name}`);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setValue(name, '');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length >= 2);
    
    // Si se limpia el input, también limpiamos la selección
    if (!value) {
      handleClearSelection();
    }
  };

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Input oculto para react-hook-form */}
        <input
          type="hidden"
          {...register(name, { required: required ? `${label} es requerido` : false })}
        />
        
        {/* Input de búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(searchTerm.length >= 2)}
            placeholder={placeholder}
            className={`
              block w-full pl-10 pr-10 py-2 border rounded-lg 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100 
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            `}
          />
          
          {/* Botón para limpiar selección */}
          {selectedUser && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Buscando usuarios...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No se encontraron usuarios
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Usuario seleccionado */}
      {selectedUser && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <User className="w-4 h-4 text-blue-500" />
          <div className="flex-1">
            <div className="font-medium text-blue-900 dark:text-blue-100">
              {selectedUser.first_name} {selectedUser.last_name}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {selectedUser.email}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default UserSearchField;