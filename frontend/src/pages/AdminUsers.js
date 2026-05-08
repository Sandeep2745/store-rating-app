import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { API.get('/users').then(r => setUsers(r.data)); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <button onClick={() => navigate('/admin')} style={{ marginBottom: 16, padding: '6px 16px' }}>← Back</button>
      <h2>All Users</h2>
      <input placeholder="Search by name or email..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 16 }} />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Role</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Rating Given</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{u.name}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{u.email}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{u.role}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{u.rating ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
