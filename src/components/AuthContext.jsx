import { createContext, useState, useEffect } from 'react';


const isTokenValid = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return accessToken !== null && accessToken !== '';
  };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}}>
          {children}
        </AuthContext.Provider>
      );
};