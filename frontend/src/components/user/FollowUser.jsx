import { useState } from 'react';

export default function FollowUser({ userId }) {
  const handleFollowUser = async () => {
    const authToken = localStorage.getItem('authToken');

    // Parameters for the backend request
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      // Execute the backend request
      const response = await fetch(
        `http://localhost:3000/api/user/${userId}/follow`,
        requestOptions
      );

      if (response.ok) {
        // Update the state to indicate that the user is now being followed
        setIsFollowing(true);
        console.log('User followed successfully.');
      } else {
        console.error('Error following user:', response.status);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFollowUser}>Follow User</button>
    </div>
  );
}
