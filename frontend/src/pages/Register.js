import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', address:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.length < 20 || form.name.length > 60) return setError('Name must be 20-60 characters');
    if (form.address.length > 400) return setError('Address max 400 characters');
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) return setError('Password: 8-16 chars, one uppercase, one special character');
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Store Rating App</h2>
        <h3 style={styles.subtitle}>Register</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Full Name (20-60 chars)" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
          <input style={styles.input} placeholder="Address" value={form.address} onChange={e => setForm({...form, address:e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', backgroundColor:'#f0f2f5' },
  card: { backgroundColor:'white', padding:'40px', borderRadius:'10px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' },
  title: { textAlign:'center', color:'#1a73e8', marginBottom:'5px' },
  subtitle: { textAlign:'center', color:'#666', marginBottom:'20px' },
  input: { width:'100%', padding:'12px', margin:'8px 0', borderRadius:'5px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  button: { width:'100%', padding:'12px', backgroundColor:'#1a73e8', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'16px', marginTop:'10px' },
  error: { color:'red', textAlign:'center' },
  link: { textAlign:'center', marginTop:'15px' }
};
