import { Navigate } from 'react-router-dom';

export function Protected({ user, children }: { user: any; children: JSX.Element }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
