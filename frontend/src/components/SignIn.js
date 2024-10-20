import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";  // ログイン状態管理のためのコンテキスト

const SignIn = () => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/v1/auth/sign_in", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // 認証トークンを保存
        document.cookie = `_access_token=${response.headers["access-token"]}`;
        document.cookie = `_client=${response.headers.client}`;
        document.cookie = `_uid=${response.headers.uid}`;

        // ユーザーの状態を更新
        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        alert("ログインに成功しました！");
        navigate("/");  // ログイン後にホームページにリダイレクト
      }
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      alert("ログインに失敗しました。");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
