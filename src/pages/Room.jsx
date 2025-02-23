import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const navigate = useNavigate();
  const { token, socket } = useAuth();
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !socket) return;
    const fetchRoom = async () => {
      try {
        socket.emit('join_room', { roomId });
        const { data } = await API.get(`/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { messages, users, active, name } = data;
        setMessages(messages);
        setRoomName(name);
        setUsers(users);
        setActive(active);
      } catch (error) {
        console.error('Failed to fetch room:', error);
        setError('Failed to load room. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    const handleJoinedRoom = ({ user }) => {
      setUsers((prevUsers) => {
        const exists = prevUsers.some((u) => u.id === user.id);
        return exists ? prevUsers : [...prevUsers, user];
      });
    };

    const handleReceiveMessage = ({ message }) => {
      setMessages((prevMessages) => {
        const exists = prevMessages.some((m) => m.id === message.id);
        return exists ? prevMessages : [...prevMessages, message];
      });
    };
    const handleUserLeft = ({ userId }) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    socket.on('joined_room', handleJoinedRoom);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.emit('leave_room');
      socket.off('joined_room', handleJoinedRoom);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_left', handleUserLeft);
    };
  }, [roomId, token, socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      socket.emit('send_message', { message: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLeaveRoom = async () => {
    const confirmLeave = window.confirm(
      'Are you sure you want to leave the room?'
    );
    if (!confirmLeave) return;
    navigate('/');
  };

  if (error) return <p>{error}</p>;
  if (loading) return <p>Joining room...</p>;
  if (!active) return <p>This room is no longer active.</p>;

  return (
    <div>
      <h2>Room: {roomName}</h2>

      <div>
        <h3>Users in Room:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Messages:</h3>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender.username}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newMessage.trim()) {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <button onClick={handleLeaveRoom}>Leave Room</button>
      </div>
    </div>
  );
};

export default Room;
