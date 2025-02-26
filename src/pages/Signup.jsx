import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({}); // Handles both client & field-specific server errors
  const [globalServerError, setGlobalServerError] = useState(null); // For general server errors

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
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        'Password must be at least 8 characters, include one uppercase letter, one number, and one special character';
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {globalServerError && <p style={{ color: 'red' }}>{globalServerError}</p>}

      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
        )}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
