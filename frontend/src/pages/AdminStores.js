import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { API.get('/stores').then(r => setStores(r.data)); }, []);

  const filtered = stores.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <button onClick={() => navigate('/admin')} style={{ marginBottom: 16, padding: '6px 16px' }}>← Back</button>
      <h2>All Stores</h2>
      <input placeholder="Search by name or address..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 16 }} />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{s.name}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{s.address}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{s.averageRating ?? 'No ratings'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
