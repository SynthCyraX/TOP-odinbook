import { useState } from 'react';

export default function useCommentCreate() {
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commentCreate = async (postId, formData) => {
    const authToken = localStorage.getItem('authToken');
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/comment/${postId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include the authentication token in the request headers
        },
        body: JSON.stringify({ formData }),
      });

      const responseJSON = await response.json();
      console.log(responseJSON);
      //   if (responseJSON.user) {
      //     setError(null);
      //     setLoading(false);
      //     // After successfull signup, navigate to login
      //     navigate('/login');
      //     return;
      //     // if the response is an array, set the error to this array
      //   } else if (responseJSON.length) {
      //     setError(responseJSON);
      //     setLoading(false);
      //     return;
      //   }
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { commentCreate, loading, error };
}
