import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserContextObject {
  username: string | null;
  userPhoto: string | null;
  userRole: string | null;
}


const AuthContext = createContext({} as UserContextObject);

export const useUserContext = () => {
  return useContext(AuthContext);
};

export const UserContext = ({ children }: any) => {
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
      setUsername(localStorage.getItem('user_name'));
      setUserPhoto(localStorage.getItem('user_picture'));
      setUserRole(localStorage.getItem('role'));
  },[location]);


  const value = {
    username,
    userPhoto,
    userRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
