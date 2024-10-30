import React, { useState } from 'react';
import { signUp } from '../api';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signUp(email, password);
      console.log('Sign-up successful:', data);
      // 成功時の処理（リダイレクトやメッセージ表示など）
      navigate('/'); // サインイン成功でホームにリダイレクト
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
