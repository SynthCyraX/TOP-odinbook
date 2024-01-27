import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import FollowUser from './FollowUser';
import UnFollowUser from './UnFollowUser';
import FollowList from './FollowList';

export default function ReadUserById() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFollows, setShowFollows] = useState(false);
  const [showFollower, setShowFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // id from params
  const loaderData = useLoaderData();
  const userId = loaderData.userid;

  // id from logged in user
  const authToken = localStorage.getItem('authToken');
  // Split the payload of the jwt and convert the ._id part
  const payload = JSON.parse(atob(authToken.split('.')[1]));
  // Define the username you are looking for
  const loggedInUserId = payload._id;

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
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/user/${userId}`,
          requestOptions
        );
        const data = await response.json();
        setUserData(data.searchedUser);

        const isFollowingUser = searchForFollower(
          data.searchedUser.follower_id,
          loggedInUserId
        );
        setIsFollowing(isFollowingUser);
      } catch (error) {
        console.error('Error while fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isFollowing]);

  const handleShowFollows = () => {
    showFollows ? setShowFollows(false) : setShowFollows(true);
  };
  const handleShowFollower = () => {
    showFollower ? setShowFollower(false) : setShowFollower(true);
  };

  function searchForFollower(arr, loggedInUserId) {
    return arr.some((obj) => obj._id === loggedInUserId);
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {userData && (
        <>
          <div>ReadUserById</div>
          <h1>User Profile:</h1>
          <p>ID: {userData._id}</p>
          <p>Name: {userData.user_name}</p>
          <p>Email: {userData.email}</p>
          <p>Follows:</p>

          {showFollows && userData.follows_id && (
            <FollowList follows={userData.follows_id} />
          )}
          <button onClick={handleShowFollows}>
            {showFollows ? 'Hide' : 'Show'}
          </button>
          <p>Follower:</p>

          {showFollower && userData.follower_id && (
            <FollowList follows={userData.follower_id} />
          )}
          <button onClick={handleShowFollower}>
            {showFollower ? 'Hide' : 'Show'}
          </button>

          {isFollowing ? (
            <UnFollowUser userId={userId} setIsFollowing={setIsFollowing} />
          ) : (
            <FollowUser userId={userId} setIsFollowing={setIsFollowing} />
          )}
          <button>Private Message</button>
        </>
      )}
    </div>
  );
}
