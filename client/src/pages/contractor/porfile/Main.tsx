import { useState } from 'react';
import { Plus } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  created: string;
}

interface NotificationSettings {
  text: boolean;
  push: boolean;
  email: boolean;
}

interface Notifications {
  statusChange: NotificationSettings;
  newMessages: NotificationSettings;
}

const ContractorProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'criss',
    lastName: 'chasky',
    email: 'chasky.sis.2@gmail.com',
    phone: '+1 (364) 212-7336',
    status: 'Activo',
    created: '19 de septiembre de 2025 17:22 horas'
  });

  const [notifications, setNotifications] = useState<Notifications>({
    statusChange: {
      text: true,
      push: true,
      email: true
    },
    newMessages: {
      text: true,
      push: true,
      email: true
    }
  });

  const handleNotificationChange = (category: keyof Notifications, type: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500 block">Agregar foto</span>
                  <span className="text-xs text-gray-400 block">JPG o PNG hasta 5MB</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {profileData.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {profileData.created}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de teléfono
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffed00] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Notificaciones</h2>
          
          <div className="space-y-6">
            {/* Status Change Notifications */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Cambio de estado del listado
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.statusChange.text}
                    onChange={() => handleNotificationChange('statusChange', 'text')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Texto</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.statusChange.push}
                    onChange={() => handleNotificationChange('statusChange', 'push')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Empujar</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.statusChange.email}
                    onChange={() => handleNotificationChange('statusChange', 'email')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Correo electrónico</span>
                </label>
              </div>
            </div>

            {/* New Messages Notifications */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Nuevos mensajes
              </h3>
              <div className="flex flex-wrap items-center gap-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.newMessages.text}
                    onChange={() => handleNotificationChange('newMessages', 'text')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Texto</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.newMessages.push}
                    onChange={() => handleNotificationChange('newMessages', 'push')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Empujar</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.newMessages.email}
                    onChange={() => handleNotificationChange('newMessages', 'email')}
                    className="w-4 h-4 text-[#ffed00] bg-gray-100 border-gray-300 rounded focus:ring-[#ffed00] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Correo electrónico</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-[#ffed00] hover:bg-[#E5C228] text-[#1A1B16] font-medium rounded-md transition-colors duration-200">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;