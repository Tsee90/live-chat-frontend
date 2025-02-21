import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav>
      <h1>Live Chat</h1>
      {user ? (
        <div>
          Welcome, {user.username}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};

export default Nav;
