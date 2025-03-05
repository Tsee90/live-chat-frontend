import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Signup.module.css';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { token } = useAuth();

  const navigate = useNavigate();
  if (token) {
    navigate('/');
  }
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalServerError, setGlobalServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field-specific errors on input
    setGlobalServerError(null); // Clear global errors when user edits
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.trim().length > 15)
      newErrors.username = 'Username cannot exceed 15 characters';
    if (formData.username.trim().length < 3)
      newErrors.username = 'Username must be at least 3 characters';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.email.trim().length > 254)
      newErrors.email = 'Email exceeds character limit';
    if (formData.email.trim().length > 6)
      newErrors.email = 'Email must be at least 6 characters';
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        'Password must be at least 8 characters, include one uppercase letter, one number, and one special character';
    if (formData.password.trim().length > 128)
      newErrors.password = 'Password exceeds character limit';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalServerError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/users/signup', formData);
      if (res) {
        console.log(res.data);
        navigate(`/verify-email?email=${encodeURIComponent(res.data.email)}`);
      }
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setGlobalServerError(null);
    } catch (error) {
      const serverData = error.response?.data;

      if (serverData?.errors) {
        const mappedErrors = {};
        serverData.errors.forEach((err) => {
          mappedErrors[err.path] = err.msg;
        });
        setErrors(mappedErrors);
      } else if (serverData?.error) {
        setGlobalServerError(serverData.error);
      } else {
        console.log(error);
        setGlobalServerError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`defaultMainContainer alignItemsCenter justifyContentCenter gap10px`}
    >
      <form
        onSubmit={handleSubmit}
        className={`defaultForm displayFlexColumn justifyContentSpaceAround alignItemsCenter gap10px`}
      >
        <div className={`fontWeightBold fontSize30px`}>Create Account</div>
        <div
          className={`displayFlexColumn alignItemsCenter defaultInputsContainer`}
        >
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className={`defaultInput`}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`defaultInput`}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`defaultInput`}
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`defaultInput`}
          />
        </div>
        {loading ? (
          <div className={`defaultSpinner`}></div>
        ) : (
          <button
            type="submit"
            className={`defaultButton fontWeightBold ${styles.signupButton}`}
          >
            Sign Up
          </button>
        )}
        {Object.keys(errors).length > 0
          ? Object.values(errors).map((error, index) => (
              <p key={index} className={`defaultErrorText`}>
                {error}
              </p>
            ))
          : null}

        {globalServerError ? (
          <p className={`defaultErrorText`}>{globalServerError}</p>
        ) : null}
      </form>
    </div>
  );
}
