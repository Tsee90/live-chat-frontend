import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CreateRoomForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    startsAt: new Date().toISOString(),
    expiresAt: '',
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
    <div>
      <h2>Create Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Expires At:</label>
          <input
            type="datetime-local"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
          />
        </div>
        {locationError && <p>{locationError}</p>}
        <div>
          <button type="submit">Create Room</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

CreateRoomForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, // 🔥 Add onSubmit prop validation
};

export default CreateRoomForm;
