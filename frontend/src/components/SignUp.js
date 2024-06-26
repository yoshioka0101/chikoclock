import React, { useState } from 'react';
import { signUp } from '../api/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    try {
      const params = {
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url: 'http://localhost:3001/' // リダイレクト先のURL
      };
      const response = await signUp(params);
      console.log(response);
    } catch (error) {
    console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignUpSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>      
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
