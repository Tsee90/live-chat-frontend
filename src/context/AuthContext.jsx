//AuthContext used to create top level variables and initiate socket connection
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [disconnected, setDisconnected] = useState(false);
  const [forcedLogout, setForcedLogout] = useState(false);
  const [location, setLocation] = useState(null);
  const [viewHeight, setViewHeight] = useState(window.visualViewport.height);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        //Check if token is expired

        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        if (!decoded.username) {
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
          setDisconnected((prev) => {
            if (!prev) return true;
            return prev;
          });
        });
        newSocket.on('force_logout', () => {
          logout();
          setForcedLogout(true);
        });

        const getPosition = async () => {
          navigator.geolocation.watchPosition(
            (position) => {
              if (position.coords) {
                setLocation(position.coords);
              }
            },
            (error) => {
              setLocation(null);
              console.error('Error getting location:', error.message);
            },
            { enableHighAccuracy: true }
          );
        };

        getPosition();

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
  }, [token, disconnected]);

  useEffect(() => {
    const handleResize = () => {
      setViewHeight(window.visualViewport.height);
    };

    window.visualViewport.addEventListener('resize', handleResize);

    return () =>
      window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.style.setProperty('--varvh', `${viewHeight}px`);
    }, 0);
  }, [viewHeight]);

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

  const logout = async () => {
    if (user?.role === 'guest') {
      try {
        socket.disconnect();
        await API.delete(`users/${user.id}`);
      } catch {
        console.log('An unexpected error occurred');
      }
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        socket,
        disconnected,
        forcedLogout,
        location,
        login,
        logout,
        viewHeight,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
