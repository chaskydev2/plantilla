// src/components/common/GuestRoute.tsx
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Navigate, Outlet } from 'react-router';

export default function GuestRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
}
