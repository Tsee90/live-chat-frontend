import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/CreateRoomForm.module.css';

const CreateRoomForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError('');
        },
        () => setLocationError('Location access denied')
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      setLocationError('Location is required');
      return;
    }

    onSubmit({ ...formData, location });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`defaultForm displayFlexColumn alignItemsCenter justifyContentSpaceAround ${styles.createRoomForm}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`fontWeightBold fontSize30px`}>New Room</div>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="enter name"
        required
        className={`defaultInput`}
      />

      {locationError && <p>{locationError}</p>}
      <div className={`displayFlexRow justifyContentSpaceAround width100`}>
        <button
          type="submit"
          className={`defaultButton ${styles.createButton}`}
        >
          Create
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`defaultButton ${styles.cancelButton}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

CreateRoomForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateRoomForm;
