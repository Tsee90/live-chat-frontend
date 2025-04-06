import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Room.module.css';
import peopleIcon from '../assets/people.svg';
import backIcon from '../assets/back.svg';
import shareIcon from '../assets/share.svg';

const Room = () => {
  const navigate = useNavigate();
  const { token, socket, viewHeight } = useAuth();
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messageContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true); //Scrolled to bottom of message container
  const inputRef = useRef(null);
  const [userModal, setUserModal] = useState(false); //Modal for user list
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    //Exit if not logged in or no socket connection
    if (!token || !socket) navigate('/login');

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
        jumpToBottom();
        setTimeout(() => {
          handleFocus(); // Delay focus slightly after state update
        }, 0);
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

  //Jumps to bottom of text when user opens mobile keyboard or chages height
  useEffect(() => {
    setTimeout(() => {
      jumpToBottom();
    }, 100);
  }, [viewHeight]);

  //This effect will allow users to scroll up in chat without it jumping to bottom everytime a new message is sent
  useEffect(() => {
    if (messageContainerRef.current && isAtBottom) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //Scroll to newest message
  const jumpToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  //Checks if user is scrolled up and updates variable
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
    } finally {
      jumpToBottom();
      setTimeout(() => {
        handleFocus(); // Delay focus slightly after state update
      }, 0);
    }
  };

  const handleLeaveRoom = async () => {
    navigate('/');
  };

  //focus on input
  const handleFocus = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleUserModal = () => {
    if (userModal) {
      setUserModal(false);
    } else {
      setUserModal(true);
    }
  };

  const handleShareModal = () => {
    if (shareModal) {
      setShareModal(false);
      setCopied(false);
    } else {
      setShareModal(true);
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      console.log('A copy error has occurred');
    } finally {
      setCopied(true);
    }
  };

  if (error) return <p>{error}</p>;
  if (loading)
    return (
      <div
        className={`defaultMainContainer alignItemsCenter justifyContentCenter`}
      >
        <div className={`defaultSpinner`}></div>
      </div>
    );
  if (!active) return <p>This room is no longer active.</p>;

  const usersList = () => {
    return (
      <ul
        className={`displayFlexColumn alignItemsCenter flexGrow1 ${styles.usersList} `}
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
    <div
      onClick={handleUserModal}
      className={`displayFlexColumn justifyContentCenter ${styles.overlay}`}
    >
      <div
        className={`displayFlexColumn justifyContentSpaceBetween alignSelfCenter flexGrow1 ${styles.usersContainer}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`displayFlexColumn flexGrow1`}>
          <div
            className={`alignSelfCenter fontWeightBold ${styles.usersTitle}`}
          >
            Users ({users.length})
          </div>
          {usersList()}
        </div>
        <button
          className={`defaultButton ${styles.usersCloseButton}`}
          onClick={handleUserModal}
        >
          Close
        </button>
      </div>
    </div>
  );

  const shareContainer = (
    <div
      onClick={handleShareModal}
      className={`displayFlexColumn justifyContentCenter ${styles.overlay}`}
    >
      <div
        className={`displayFlexColumn justifyContentSpaceBetween alignSelfCenter ${styles.shareContainer}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`alignSelfCenter fontWeightBold ${styles.shareTitle}`}>
          Share
        </div>
        <div className={`${styles.copyUrl}`}>
          <div>{window.location.href}</div>
        </div>

        {copied ? (
          <div className={`${styles.copied}`}>Copied!</div>
        ) : (
          <button
            className={`defaultButton ${styles.copyButton}`}
            onClick={handleCopy}
          >
            Copy
          </button>
        )}
      </div>
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
        ref={inputRef}
        onFocus={() => {
          setTimeout(() => {
            jumpToBottom(); // Delay focus slightly after state update
          }, 50);
        }}
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleSendMessage}
        className={`${styles.sendButton}`}
      >
        Send
      </button>
    </div>
  );

  const messageContainer = (
    <div
      ref={messageContainerRef}
      className={` ${styles.messageContainer}`}
      onScroll={handleScroll}
    >
      {messages.map((msg) => (
        <div key={msg.id} className={`${styles.messageItem}`}>
          <span className={`themeColor fontWeightBold`}>
            {msg.sender.username}:
          </span>{' '}
          {msg.content}
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

  const titleContainer = (
    <div
      className={`displayFlexRow justifyContentSpaceBetween alignItemsCenter gap10px ${styles.titleContainer}`}
    >
      <div className={`fontWeightBold ${styles.title}`}>{roomName}</div>
      <div className={`displayFlexRow ${styles.iconContainer}`}>
        <div
          className={`displayFlexRow alignItemsCenter`}
          onClick={handleShareModal}
        >
          <img src={shareIcon} alt="" className={`${styles.shareIcon}`} />
        </div>
        <div
          className={`displayFlexRow gap10px ${styles.usersIcon}`}
          onClick={handleUserModal}
        >
          <img
            src={peopleIcon}
            alt="people"
            className={`${styles.iconPeople}`}
          />
        </div>
        <button onClick={handleLeaveRoom} className={` ${styles.leaveButton}`}>
          <img src={backIcon} alt="" className={`${styles.iconBack}`} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={`displayFlexColumn ${styles.messageWrapper}`}>
        <div className={`${styles.headerContainer}`}>{titleContainer}</div>

        {messageContainer}
        {messageInput}
      </div>

      {userModal ? usersContainer : null}
      {shareModal ? shareContainer : null}
    </div>
  );
};

export default Room;
