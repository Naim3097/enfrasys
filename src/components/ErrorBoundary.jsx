import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('🚨 Error Boundary Caught Error:', error);
    console.error('🚨 Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '2rem auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h1 style={{ color: '#d32f2f' }}>🚨 Application Error</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Something went wrong. This is likely a Firebase configuration issue on Vercel.
          </p>
          
          <div style={{ 
            textAlign: 'left', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3>🔧 Troubleshooting Steps:</h3>
            <ol>
              <li>Check Vercel environment variables are set</li>
              <li>Verify Firebase project configuration</li>
              <li>Check browser console for detailed errors</li>
              <li>Ensure Firebase project has billing enabled</li>
            </ol>
          </div>

          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Click to see technical details
            </summary>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              margin: '1rem 0',
              borderRadius: '4px',
              textAlign: 'left',
              fontSize: '0.9rem',
              overflow: 'auto'
            }}>
              <strong>Error:</strong>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              
              <strong>Component Stack:</strong>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </div>
          </details>

          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
