// context/UserContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // const fetchUser = async () => {
  //   setLoadingUser(true);
  //   try {
  //     const res = await axios.get('/api/me', { withCredentials: true });
  //     setUser(res.data.user);
  //   } catch {
  //     setUser(null);
  //   } finally {
  //     setLoadingUser(false);
  //   }
  // };

  const fetchUser = async () => {
  setLoadingUser(true);
  try {
    const res = await fetch('/api/me', {
      method: "GET",
      credentials: "include", // same as axios { withCredentials: true }
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();
    setUser(data.user);
  } catch (error) {
    console.error(error);
    setUser(null);
  } finally {
    setLoadingUser(false);
  }
};


  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loadingUser, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
