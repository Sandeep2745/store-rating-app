import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
        <button onClick={() => navigate('/admin/users')} style={{ padding: '12px 24px' }}>Manage Users</button>
        <button onClick={() => navigate('/admin/stores')} style={{ padding: '12px 24px' }}>Manage Stores</button>
        <button onClick={() => navigate('/change-password')} style={{ padding: '12px 24px' }}>Change Password</button>
        <button onClick={logout} style={{ padding: '12px 24px', background: '#e55', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
}
