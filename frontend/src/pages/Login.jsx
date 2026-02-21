import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async () => {
    const res = await api.post("/auth/login",{email,password});
    localStorage.setItem("token",res.data.token);
    window.location.href="/home";
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}