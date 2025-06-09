import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextSafe';
import { toast } from 'react-toastify';
import { setupDemoAccount } from '../utils/demoAccountSetup';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup, firebaseError, isFirebaseInitialized } = useAuth();
  const navigate = useNavigate();

  // Debug Firebase initialization on component mount
  useEffect(() => {
    console.log('🔥 LoginPage mounted, checking Firebase...');
    console.log('Firebase initialized:', isFirebaseInitialized);
    console.log('Firebase error:', firebaseError);
    console.log('Auth functions available:', { hasLogin: !!login, hasSignup: !!signup });
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Vercel deployment:', process.env.VERCEL === '1');    
    if (firebaseError) {
      console.error('❌ Firebase initialization error in LoginPage:', firebaseError);
    }
  }, [login, firebaseError, isFirebaseInitialized, signup]);

  // Show Firebase error if initialization failed
  if (firebaseError || !isFirebaseInitialized) {
    return (
      <div className="login-container">
        <div className="login-form" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>🚨 Firebase Configuration Error</h2>
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '1rem 0',
            textAlign: 'left'
          }}>
            <p style={{ color: '#856404', marginBottom: '1rem', fontWeight: 'bold' }}>
              Firebase failed to initialize properly on Vercel.
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <strong>Error:</strong> {firebaseError || 'Firebase initialization failed'}
            </p>
            
            <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>🔧 Required fixes:</h4>
            <ol style={{ color: '#666', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
              <li>Set Firebase environment variables in Vercel Dashboard</li>
              <li>Add Vercel domain to Firebase Console authorized domains</li>
              <li>Ensure Firebase project has billing enabled</li>
              <li>Verify Firebase API keys are correct</li>
            </ol>
          </div>
          
          <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1rem' }}>
            Environment: {process.env.NODE_ENV} | Vercel: {process.env.VERCEL === '1' ? 'Yes' : 'No'}
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }
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
      navigate('/');
    } catch (error) {
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
          toast.error('Incorrect password.');        } else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email address.');
        } else {
          toast.error(`Failed to log in: ${error.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      console.log('🧪 Attempting demo login...');
      
      // First try to login with demo credentials
      await login('demo@byki.com', 'demo123456');
      toast.success('Demo login successful!');
      navigate('/');
    } catch (error) {
      console.log('Demo login failed, trying to create account:', error);
      
      // If login fails, try to create the demo account
      try {
        await setupDemoAccount();
        await login('demo@byki.com', 'demo123456');
        toast.success('Demo account created and logged in!');
        navigate('/');      } catch (setupError) {
        console.error('Demo setup failed:', setupError);
        toast.error('Demo login failed. Please try manual login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sparepart Management System</h2>
        
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>
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
              Email: <code>demo@byki.com</code> | Password: <code>demo123456</code>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@byki.com');
                  setPassword('demo123456');
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
                Fill Form
              </button>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Logging in...' : 'Demo Login'}
              </button>
            </div>
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
