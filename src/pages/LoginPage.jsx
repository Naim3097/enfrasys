import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await signup(email, password);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Logged in successfully');
      }
      navigate('/');    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (isSignUp) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Account already exists. Try signing in instead.');
          setIsSignUp(false);
        } else if (error.code === 'auth/weak-password') {
          toast.error('Password should be at least 6 characters.');
        } else {
          toast.error(`Failed to create account: ${error.message}`);
        }
      } else {
        if (error.code === 'auth/user-not-found') {
          toast.error('No account found. Try creating an account first.');
          setIsSignUp(true);
        } else if (error.code === 'auth/wrong-password') {
          toast.error('Incorrect password.');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email address.');
        } else {
          toast.error(`Failed to log in: ${error.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sparepart Management System</h2>        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>
          {isSignUp ? 'Create a new account' : 'Sign in to your account'}
        </p>
        
        {/* Demo Account Quick Access */}
        {!isSignUp && (
          <div style={{ 
            background: '#f0f8ff', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '1px solid #b3d9ff'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#0066cc' }}>
              📋 Demo Account
            </p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
              Email: <code>demo@byki.com</code> | Password: <code>demo123</code>
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('demo@byki.com');
                setPassword('demo123');
              }}
              style={{
                background: '#0066cc',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Use Demo Account
            </button>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--deep-teal-green)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
