import { useState, useEffect } from 'react';

export default function UpdateUser() {
  const [userData, setUserData] = useState({
    user_name: '',
    email: '',
    img_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const authToken = localStorage.getItem('authToken');
  // Split the payload of the jwt and convert the ._id part
  const payload = JSON.parse(atob(authToken.split('.')[1]));
  // Define the username you are looking for
  const userId = payload._id;

  useEffect(() => {
    const fetchData = async () => {
      // Parameters for the backend request
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      };
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/${userId}`,
          requestOptions
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.error.errors[0].msg);
          return;
        }
        setUserData(data.searchedUser);
        setError('');
      } catch (error) {
        console.error('Error while fetching user:', error);
        setError(error);
      }
    };

    fetchData();
  }, [userId, authToken]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSuccess(false);
    // Parameters for the backend request
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/update`,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error.errors[0].msg);
        return;
      }
      // Save the token, e.g., in local storage
      localStorage.setItem('authToken', data.token);

      console.log('User updated:', data);
      setError('');
    } catch (error) {
      console.error('Error while updating user:', error);
      setError(error);
    }
    setSuccess(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div id="updateUserComponent">
      <h1>Update User:</h1>
      <form className="mainForm">
        <div className="input-group">
          <label htmlFor="user_name" className="input-group_label">
            Username:
          </label>
          <input
            id="user_name"
            className="input-group_input"
            type="text"
            name="user_name"
            value={userData.user_name}
            onChange={handleChange}
            pattern="[a-zA-Z0-9]{6,}"
          />
          <span className="input-group_error">
            Username must be at least 6 characters long
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="email" className="input-group_label">
            Email:
          </label>
          <input
            id="email"
            className="input-group_input"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            autoComplete="true"
          />
          <span className="input-group_error">Email has the wrong format</span>
        </div>
        <div className="input-group">
          <label htmlFor="img_url" className="input-group_label">
            Image Url:
          </label>
          <input
            id="img_url"
            className="input-group_input"
            type="text"
            name="img_url"
            value={userData.img_url}
            onChange={handleChange}
          />
          <span className="input-group_error">
            img_url has the wrong format
          </span>
        </div>

        <button className="form-btn" onClick={handleUpdateUser}>
          Update User
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>User updated!</div>}
      </form>
    </div>
  );
}
