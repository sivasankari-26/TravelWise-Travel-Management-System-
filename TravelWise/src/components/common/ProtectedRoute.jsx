import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function CustomerRoute({ children }) {
  const { customer, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!customer) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { admin, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
