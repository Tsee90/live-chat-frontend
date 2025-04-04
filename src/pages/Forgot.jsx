import { useNavigate } from 'react-router-dom';

const Forgot = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>Please select an option</div>
      <div>I forgot my username</div>
      <div
        onClick={() => {
          navigate('/password-reset');
        }}
      >
        I forgot my password
      </div>
    </div>
  );
};

export default Forgot;
