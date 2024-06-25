import React, { useState, useContext } from 'react';
import { signIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn({ email, password });
      if (response.status === 200) {
        alert('ログインに成功しました');
        setIsSignedIn(true);
        setCurrentUser(response.data.data);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('ログインに失敗しました');
    }
  };

  return (
    <div>
      <h1>SignInページです</h1>
      <form onSubmit={handleSignInSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;