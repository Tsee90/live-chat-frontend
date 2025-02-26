import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/users/login', formData);
      login(res.data.token);
      navigate('/');
    } catch (error) {
      console.log(error);
      setError('Invalid credentials');
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
        <div className={`fontWeightBold ${styles.title}`}>Log In</div>
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
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className={`defaultButton ${styles.loginButton}`}>
          Login
        </button>
        <div className={`${styles.noAccount}`}>
          Don't have an account?{' '}
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
