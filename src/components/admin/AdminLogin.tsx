import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, User, GraduationCap, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple authentication (in production, use proper backend auth)
    if (username === 'admin' && password === 'admin123') {
      setTimeout(() => {
        onLogin(username);
        setLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setError('Invalid username or password');
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background decoration */}
      <div className="admin-login-bg">
        <div className="admin-login-blob admin-login-blob-1" />
        <div className="admin-login-blob admin-login-blob-2" />
        <div className="admin-login-blob admin-login-blob-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="admin-login-container"
      >
        <div className="admin-login-card">
          <div className="admin-login-header">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="admin-login-icon-wrapper"
            >
              <GraduationCap className="admin-login-icon" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="admin-login-title"
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="admin-login-subtitle"
            >
              Sign in to FutureSchool Admin
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-login-error"
              >
                <AlertCircle className="admin-login-error-icon" />
                <span className="admin-login-error-text">{error}</span>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="admin-login-field"
            >
              <label htmlFor="username" className="admin-login-label">Username</label>
              <div className="admin-login-input-wrapper">
                <User className="admin-login-input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="admin-login-input"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="admin-login-field"
            >
              <label htmlFor="password" className="admin-login-label">Password</label>
              <div className="admin-login-input-wrapper">
                <Lock className="admin-login-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="admin-login-input with-toggle"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-login-toggle-btn"
                >
                  {showPassword ? <EyeOff className="admin-login-toggle-icon" /> : <Eye className="admin-login-toggle-icon" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                className="admin-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="admin-login-spinner"
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="admin-login-footer"
          >
            <p className="admin-login-footer-text">
              Demo credentials: <span>admin</span> / <span>admin123</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
