import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //If logged in navigate to home
    if (token) {
      navigate('/');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await API.post('/users/login', formData);
      login(res.data.token);
      navigate('/');
    } catch {
      setError(`Invalid credentials`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`defaultMainContainer alignItemsCenter justifyContentCenter ${styles.mainContainer}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`displayFlexColumn justifyContentSpaceAround alignItemsCenter defaultForm ${styles.form}`}
      >
        <div className={`fontWeightBold ${styles.title}`}>Welcome!</div>
        <div
          className={`displayFlexColumn alignItemsCenter defaultInputsContainer`}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`defaultInput`}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`defaultInput`}
          />
        </div>
        {error && <p className={`defaultErrorText`}>{error}</p>}
        {loading ? (
          <div className={`defaultSpinner`}></div>
        ) : (
          <button
            type="submit"
            className={`defaultButton ${styles.loginButton}`}
          >
            Log In
          </button>
        )}{' '}
        <div
          className={`displayFlexColumn alignItemsCenter ${styles.noAccount}`}
        >
          <div>Don't have an account? </div>
          <a
            href="/signup"
            className={`themeColor fontWeightBold ${styles.signupLink}`}
          >
            Sign Up Here
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
