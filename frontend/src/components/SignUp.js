import React, { useState } from "react";
import { signUp } from "../api/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const params = {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    };
    try {
      await signUp(params);
      // 登録成功後の処理を追加（例：リダイレクトやメッセージ表示）
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
