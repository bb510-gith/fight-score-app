import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://fight-score-app-backend.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        login(accessToken);
        navigate('/'); // Redirect to home page after login
      } else {
        setError('パスワードが正しくありません。');
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました。');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">パスワード</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">ログイン</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
