import { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import API from '../api';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { code } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        'Password must be at least 8 characters, include one uppercase letter, one number, and one special character';
    if (formData.password.trim().length > 128)
      newErrors.password = 'Password exceeds character limit';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    setErrors({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    console.log(code, email, formData.password);
    API.post(`/users/password-reset/${code}`, {
      email,
      newPassword: formData.password,
    });
  };
  return (
    <div>
      <div>Reset Password</div>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="New password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {Object.keys(errors).length > 0
        ? Object.values(errors).map((error, index) => (
            <p key={index} className={`defaultErrorText`}>
              {error}
            </p>
          ))
        : null}
    </div>
  );
};

export default PasswordReset;
