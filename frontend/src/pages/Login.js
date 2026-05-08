import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'admin') navigate('/admin/dashboard');
      else if (res.data.role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Store Rating App</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <a href="/register">Register</a></p>
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
