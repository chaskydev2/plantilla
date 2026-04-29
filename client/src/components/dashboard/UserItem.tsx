import type { UserItemProps } from "@/types/dashboard";

/**
 * UserItem Component
 * Displays user information with avatar, name, role, and online status
 */
const UserItem = ({ name, role, avatar, status }: UserItemProps) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          status === 'online' ? 'bg-slate-500' : 'bg-gray-300'
        }`}></div>
      </div>
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </div>
    <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">
      VIEW
    </button>
  </div>
);

export default UserItem;