"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext } from "react";

export const AuthContext = createContext();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const AuthContextProvider = ({ children }) => {
  const router = useRouter();

  const login = async (inputs) => {
    try {
      await axios
        .post(`${baseUrl}/auth/login`, inputs)
        .then((res) => {
          localStorage.setItem("userToken", res.data.token);
          localStorage.setItem("userId", res.data.user._id);
          localStorage.setItem("userName", res.data.user.username);
          localStorage.setItem("userEmail", res.data.user.email);
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const register = async (inputs) => {
    try {
      await axios
        .post(`${baseUrl}/auth/register`, inputs)
        .then((res) => {
          localStorage.setItem("userToken", res.data.token);
          localStorage.setItem("userId", res.data.user._id);
          localStorage.setItem("userName", res.data.user.username);
          localStorage.setItem("userEmail", res.data.user.email);
          router.replace("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.setItem("userToken", null);
    localStorage.setItem("userId", null);
    localStorage.setItem("userName", null);
    localStorage.setItem("userEmail", null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
