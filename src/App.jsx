import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';

function App() {
  const { forcedLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (forcedLogout) {
      navigate('/login');
    }
  }, [forcedLogout, navigate]);

  return (
    <div className={`displayFlexColumn flexGrow1`}>
      <Nav />
      <Outlet />
    </div>
  );
}

export default App;
