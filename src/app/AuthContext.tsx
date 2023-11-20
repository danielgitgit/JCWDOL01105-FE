import React, { createContext } from "react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface Token {
  id: string;
  role: string;
  image_url: string;
}

interface Profile {
  id: string | null;
  role: string | null;
  imageUrl: string | null;
  isLogin: boolean;
  token: string | null;
  loginGoogle: (payload: string) => void;
  login: (payload: string) => void;
  logout: () => void;
}

const init = { id: "", role: "", imageUrl: "", isLogin: false, token: "", login() {}, logout() {}, loginGoogle() {} };

export const AuthContext = createContext<Profile>(init);
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const getToken = () => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : false;
    if (token) {
      console.log("context", token);
      const payload: Token = jwtDecode(token);
      const data = { id: payload.id, role: payload.role, imageUrl: payload.image_url, isLogin: true, token: token };
      return data;
    } else {
      return { id: null, role: null, imageUrl: null, isLogin: false, token: null };
    }
  };
  sessionStorage.clear();
  const { id, imageUrl, role, isLogin, token } = getToken();
  const [rand, setRand] = useState(0);

  const loginGoogle = (payload: string) => {
    sessionStorage.setItem("token", payload);
    setRand(Math.random());
  };

  const login = (payload: string) => {
    sessionStorage.setItem("token", payload);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    console.log(payload);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {}, [rand]);
  return (
    <AuthContext.Provider value={{ id, role, imageUrl, isLogin, token, loginGoogle, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
