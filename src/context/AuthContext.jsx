import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [disconnected, setDisconnected] = useState(true);
  const [forcedLogout, setForcedLogout] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        setUser(decoded);
        const newSocket = io(
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
          { extraHeaders: { Authorization: `Bearer ${token}` } }
        );
        setSocket(newSocket);
        newSocket.on('connect', () => {
          setDisconnected((prev) => {
            if (prev) return false;
            return prev;
          });
        });
        newSocket.on('connect_error', () => {
          console.log('connection error');
          setDisconnected((prev) => {
            if (!prev) return true;
            return prev;
          });
        });
        newSocket.on('force_logout', () => {
          logout();
          setForcedLogout(true);
        });
        return () => {
          newSocket.disconnect();
          newSocket.removeAllListeners();
        };
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setSocket(null);
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Invalid token during login:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, socket, disconnected, forcedLogout, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
