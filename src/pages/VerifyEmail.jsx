import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const decodedEmail = searchParams.get('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log(decodedEmail);
    try {
      const response = await API.post('/users/verify-email', {
        email: decodedEmail,
        code,
      });

      if (response.status === 200) {
        setSuccess('Email verified successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Verification failed. Try again.'
      );
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>
        Enter the 6-digit code sent to <strong>{decodedEmail}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          maxLength={6}
          required
        />
        <button type="submit">Verify</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default VerifyEmail;
