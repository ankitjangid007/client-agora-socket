"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const loginHandle = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="formContainer">
      <div className="smart-header">
        <div className="smart-logo">
          <h2>
            <Link id="smart-logo-h2" href="/">
              Meet
            </Link>
          </h2>
        </div>
      </div>

      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={loginHandle}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p>
          Not Registered? <Link href="/register">Register Now!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
