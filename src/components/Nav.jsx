import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <h1>Live Chat</h1>
      {user ? (
        <div>
          Welcome, {user.username}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};

export default Nav;
