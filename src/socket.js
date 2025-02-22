import { io } from 'socket.io-client';
const token = localStorage.getItem('token');

const socket = io(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  { extraHeaders: { Authorization: `Bearer ${token}` } }
);
export default socket;
