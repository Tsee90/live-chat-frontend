import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Room = () => {
  const { token } = useAuth();
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
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
      }
    };

    fetchRoom();
  }, [roomId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await API.post(
        `/rooms/${roomId}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (error) return <p>{error}</p>;
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
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Room;
