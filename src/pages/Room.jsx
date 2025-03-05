import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Room.module.css';

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
  const messageContainerRef = useRef(null);
  const listRef = useRef(null);
  const listWrapperRef = useRef(null);
  const [listOverflow, setListOverflow] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

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

    const handleReceiveMessage = ({ messages }) => {
      setMessages(messages);
    };
    const handleUserLeft = ({ userId }) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    const handleReconnect = () => {
      console.log('reconnecting...');
      fetchRoom();
    };

    socket.on('joined_room', handleJoinedRoom);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_left', handleUserLeft);
    socket.on('connect', handleReconnect);

    return () => {
      socket.emit('leave_room');
      socket.off('joined_room', handleJoinedRoom);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_left', handleUserLeft);
      socket.off('connect', handleReconnect);
    };
  }, [roomId, token, socket]);

  useEffect(() => {
    if (messageContainerRef.current && isAtBottom) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const jumpToBottom = () => {
    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    if (listRef.current && listWrapperRef.current) {
      if (listRef.current.scrollWidth > listWrapperRef.current.clientWidth) {
        setListOverflow(true);
      } else {
        setListOverflow(false);
      }
    }
  }, [users]);

  const handleScroll = () => {
    const container = messageContainerRef.current;
    const isUserAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;
    setIsAtBottom(isUserAtBottom);
  };

  const handleSendMessage = async () => {
    const createdAt = new Date().toISOString();
    if (!newMessage.trim()) return;

    try {
      socket.emit('send_message', { message: newMessage, createdAt });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLeaveRoom = async () => {
    navigate('/');
  };

  if (error) return <p>{error}</p>;
  if (loading) return <p>Joining room...</p>;
  if (!active) return <p>This room is no longer active.</p>;

  const usersList = () => {
    return (
      <ul
        className={`displayFlexRow gap10px ${styles.usersList} ${
          listOverflow ? styles.overflowAnimate : ''
        }`}
      >
        {users.map((user) => (
          <li key={user.id} className={`displayFlexRow`}>
            {user.username}
          </li>
        ))}
      </ul>
    );
  };

  const usersContainer = (
    <div className={`displayFlexRow gap10px ${styles.usersContainer}`}>
      <div className={`${styles.usersTitle}`}>Users ({users.length}):</div>
      <div
        ref={listWrapperRef}
        className={`flexGrow1 ${styles.usersListWrapper}`}
      >
        <div ref={listRef} className={`displayFlexRow `}>
          {usersList()}
          {listOverflow ? usersList() : ''}
        </div>
      </div>
    </div>
  );

  const messageContainer = (
    <div
      ref={messageContainerRef}
      className={`flexGrow1 ${styles.messageContainer}`}
      onScroll={handleScroll}
    >
      {messages.map((msg) => (
        <div key={msg.id} className={`${styles.messageItem}`}>
          <strong>{msg.sender.username}:</strong> {msg.content}
        </div>
      ))}
      {!isAtBottom ? (
        <button
          className={`${styles.jumpToBottomButton}`}
          onClick={jumpToBottom}
        >
          Jump To Bottom
        </button>
      ) : null}
    </div>
  );

  const messageInput = (
    <div className={`displayFlexRow  ${styles.inputContainer}`}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
        }}
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && newMessage.trim()) {
            handleSendMessage();
          }
        }}
        className={`flexGrow1 ${styles.input}`}
        maxLength={2000}
      />
      <button onClick={handleSendMessage} className={`${styles.sendButton}`}>
        Send
      </button>
    </div>
  );

  const titleContainer = (
    <div
      className={`displayFlexRow justifyContentSpaceBetween alignItemsCenter ${styles.titleContainer}`}
    >
      <div className={`fontWeightBold fontSize30px`}>{roomName}</div>
      <button
        onClick={handleLeaveRoom}
        className={`defaultButton ${styles.leaveButton}`}
      >
        Leave
      </button>
    </div>
  );

  return (
    <div className={`defaultMainContainer`}>
      <div className={`displayFlexColumn ${styles.messageWrapper}`}>
        <div className={`${styles.headerContainer}`}>
          {titleContainer}
          {usersContainer}
        </div>
        {messageContainer}
        {messageInput}
      </div>
    </div>
  );
};

export default Room;
