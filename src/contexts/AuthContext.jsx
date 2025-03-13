import Cookies from 'js-cookie';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loginUser(credentials);
      if (data?.user){
        setCurrentUser(data.user);
      Cookies.set('authToken', data.token, { expires: 7, secure: true });
      localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Error Message:", err.response.data.message);
        setError(err.response.data.message);
      }else{
        setError(err.message || 'Failed to register');
      }
      setLoading(false);
      return
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const responce = await registerUser(userData);
      setLoading(false);
      setCurrentUser(responce.data.user);
      Cookies.set('authToken', responce.data.token, { expires: 7, secure: true });
      localStorage.setItem('user', JSON.stringify(responce.data.user));
      return responce;
    } catch (err) {
      console.log('error', err);
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Error Message:", err.response.data.message);
        setError(err.response.data.message);
      }else{
        setError(err.message || 'Failed to register');
      }
      
      setLoading(false);
      return

    }
  };

  const logout = () => {
    setCurrentUser(null);
    Cookies.remove('authToken');
    localStorage.removeItem('user');
  };

  const updateUserInContext = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUserInContext,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;