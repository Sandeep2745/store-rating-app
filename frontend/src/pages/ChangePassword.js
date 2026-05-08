import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.patch('/users/change-password', form);
      setMsg('✅ Password changed successfully!');
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || 'Error'));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Change Password</h2>
      <input type="password" placeholder="Old Password"
        onChange={e => setForm({ ...form, oldPassword: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
      <input type="password" placeholder="New Password"
        onChange={e => setForm({ ...form, newPassword: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
      <button onClick={handleSubmit} style={{ marginRight: 8, padding: '8px 16px' }}>Change</button>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>Back</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
