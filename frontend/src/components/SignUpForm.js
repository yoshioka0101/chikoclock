import React, { useState } from 'react';
import { signUp } from '../auth';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert('サインアップ成功');
      navigate('/'); // サインイン成功でホームにリダイレクト
    } catch (error) {
      alert('サインアップに失敗しました');
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">サインアップ</button>
    </form>
  );
};

export default SignUpForm;
