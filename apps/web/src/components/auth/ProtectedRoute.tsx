// apps/web/src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getUserPayload } from '../../utils/auth';

interface ProtectedRouteProps {
  allowedRoles?: ('USER' | 'ORGANIZER' | 'ADMIN')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('eventopia_token');
  const user = getUserPayload();

  // Se não tem token ou o token é inválido, manda para o login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige roles específicas e o usuário não tem nenhuma delas, manda para a Home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Se passou em tudo, renderiza a página protegida
  return <Outlet />;
}