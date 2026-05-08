import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/stores/my-store').then(r => {
      setStore(r.data);
      return API.get(`/ratings/store/${r.data.id}`);
    }).then(r => setRatings(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Store Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/change-password')} style={{ padding: '6px 14px' }}>Change Password</button>
          <button onClick={logout} style={{ padding: '6px 14px', background: '#e55', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      {store ? (
        <>
          <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginTop: 16 }}>
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <p>⭐ Average Rating: <strong>{store.averageRating ?? 'No ratings yet'}</strong></p>
          </div>
          <h3 style={{ marginTop: 24 }}>Ratings received</h3>
          {ratings.length === 0 ? <p>No ratings yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>User</th>
                  <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{r.userName ?? r.userId}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{'⭐'.repeat(r.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : <p>Loading store info...</p>}
    </div>
  );
}
