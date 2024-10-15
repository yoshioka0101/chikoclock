import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post("http://localhost:3000/auth", {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      confirm_success_url: "http://localhost:3000/signin", // 成功後のリダイレクト先
      });

      if (response.status === 200) {
      alert("確認メールを送信しました。");
      navigate("/signin");
      }
  } catch (error) {
      console.error("サインアップに失敗しました:", error);
      alert("サインアップに失敗しました。");
  }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
    </div>
  );
};

export default SignUp;
