"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { register } = useContext(AuthContext);

  const handleButton = async (e) => {
    e.preventDefault();
    await register({ username: username, email: email, password: password });
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
        <span className="title">Register</span>
        <form onSubmit={handleButton}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              userName
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
            Register
          </button>
        </form>
        <p>
          Already Registered? <Link href="/login">Login!</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
