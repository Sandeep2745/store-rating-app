import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState({});
  const { logout } = useAuth();

  useEffect(() => { fetchStores(); }, []);

  const fetchStores = async () => {
    const res = await API.get('/stores');
    setStores(res.data);
    const ratings = {};
    for (const store of res.data) {
      try {
        const r = await API.get(`/ratings/store/${store.id}`);
        if (r.data) ratings[store.id] = r.data.rating;
      } catch {}
    }
    setRating(ratings);
  };

  const submitRating = async (storeId, value) => {
    await API.post('/ratings', { store_id: storeId, rating: value });
    fetchStores();
  };

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>All Stores</h2>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
      <input style={styles.search} placeholder="Search by name or address..." value={search} onChange={e => setSearch(e.target.value)} />
      <div style={styles.grid}>
        {filtered.map(store => (
          <div key={store.id} style={styles.card}>
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <p>⭐ Overall Rating: {store.averageRating || 'No ratings yet'}</p>
            <p>Your Rating: {rating[store.id] || 'Not rated'}</p>
            <div>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => submitRating(store.id, n)} style={{...styles.star, backgroundColor: rating[store.id] >= n ? '#ffd700' : '#ddd'}}>
                  {n}⭐
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding:'20px', maxWidth:'1200px', margin:'0 auto' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  logout: { padding:'8px 16px', backgroundColor:'#e53935', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
  search: { width:'100%', padding:'12px', margin:'20px 0', borderRadius:'5px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' },
  card: { backgroundColor:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  star: { margin:'2px', padding:'5px 10px', border:'none', borderRadius:'5px', cursor:'pointer' }
};
