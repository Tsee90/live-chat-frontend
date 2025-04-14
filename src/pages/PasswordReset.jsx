import { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import styles from '../styles/PasswordReset.module.css';
import Footer from '../components/Footer';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { code } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    console.log(code, email, formData.password);
    try {
      await API.post(`/users/password-reset/${code}`, {
        email,
        newPassword: formData.password,
      });
      setSuccess(true);
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return (
    <div
      className={`defaultMainContainer gap10px alignItemsCenter marginTop25px`}
    >
      <div className={`fontWeightBold textAlignCenter`}>Reset Password</div>
      {success ? (
        <div className={`displayFlexColumn gap10px alignItemsCenter`}>
          <div className={`textAlignCenter`}>
            Your password has been successfully reset.
          </div>
          <div>
            Return to{' '}
            <span
              className={`defaultLink textAlignCenter`}
              onClick={() => {
                navigate('/login');
              }}
            >
              log in
            </span>
          </div>
        </div>
      ) : (
        <form
          action=""
          onSubmit={handleSubmit}
          className={`displayFlexColumn gap10px alignItemsCenter ${styles.form}`}
        >
          <input
            type="password"
            name="password"
            placeholder="New password"
            onChange={handleChange}
            className={`defaultInput`}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            onChange={handleChange}
            className={`defaultInput`}
          />
          <button type="submit" className={`defaultButton ${styles.button}`}>
            Submit
          </button>
        </form>
      )}

      {Object.keys(errors).length > 0
        ? Object.values(errors).map((error, index) => (
            <p key={index} className={`defaultErrorText`}>
              {error}
            </p>
          ))
        : null}
      <Footer></Footer>
    </div>
  );
};

export default PasswordReset;
