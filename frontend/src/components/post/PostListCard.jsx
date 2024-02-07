import styles from '../../css/PostListCard.module.css';
import Icon from '@mdi/react';
import { mdiCalendarMonthOutline } from '@mdi/js';
import { mdiChatOutline } from '@mdi/js';

import PostEdit from './PostEdit';
import CommentCreate from '../comment/CommentCreate';

// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostLike from './PostLike';
import PostUnLike from './PostUnLike';

export default function PostListCard({ postId }) {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isAuthor, setIsAuthor] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCommentCreate, setIsOpenCommentCreate] = useState(false);
  const [isOpenCommentList, setIsOpenCommentList] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // id from logged in user
  const authToken = localStorage.getItem('authToken');
  // Split the payload of the jwt and convert the ._id part
  const payload = JSON.parse(atob(authToken.split('.')[1]));
  // Define the username you are looking for
  const loggedInUserId = payload._id;

  function searchForAuthor(author, loggedInUserId) {
    return author._id === loggedInUserId;
  }

  function searchForLikes(arr, loggedInUserId) {
    return arr.some((obj) => obj === loggedInUserId);
  }

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
          `http://localhost:3000/api/post/${postId}`,
          requestOptions
        );
        const data = await response.json();
        setPostData(data.searchedPost);

        const isAuthorOfPost = searchForAuthor(
          data.searchedPost.author_id,
          loggedInUserId
        );
        setIsAuthor(isAuthorOfPost);

        const isLikingPost = searchForLikes(
          data.searchedPost.likes_id,
          loggedInUserId
        );
        setIsLiking(isLikingPost);
      } catch (error) {
        console.error('Error while fetching user:', error);
      } finally {
        setLoading(false);
        // remove show...
      }
    };

    fetchData();
  }, [postId, isLiking, authToken, loggedInUserId]);

  // useEffect(() => {
  //   const isLikingPost = searchForLikes(likes, loggedInUserId);
  //   setIsLiking(isLikingPost);
  // }, [likes, loggedInUserId]);

  const handleOverlayClick = (event) => {
    if (event.target.id === 'overlay') {
      setIsOpenModal(false);
    }
  };
  const handlePostEdit = () => {
    console.log(postId);
    setIsOpenModal(true);
  };

  const handleCommentCreate = () => {
    isOpenCommentCreate
      ? setIsOpenCommentCreate(false)
      : setIsOpenCommentCreate(true);
  };
  const handleShowCommentList = () => {
    isOpenCommentList
      ? setIsOpenCommentList(false)
      : setIsOpenCommentList(true);
  };
  console.log(postData);
  return (
    <>
      {loading && <div></div>}
      {postData && (
        <>
          <div className={styles.card}>
            {/* Button um modal zu öffnen um post updaten zu können */}
            <button onClick={handlePostEdit}>Post Edit</button>
            <button onClick={handleCommentCreate}>Comment Create</button>

            {/* <Link to={`/post/${postId}`}> */}
            <div className={styles.stats}>
              <div className={styles.author}>
                {postData.author_id.user_name}
              </div>
              <div className={styles.content}>{postData.content}</div>
              <div className={styles.footer}>
                <div className={styles.iconGroup}>
                  <Icon
                    onClick={handleShowCommentList}
                    path={mdiChatOutline}
                    size={1}
                  />
                  <div>{postData.comments_id.length}</div>
                </div>
                <div className={styles.iconGroup}>
                  {isLiking ? (
                    <PostUnLike postId={postId} setIsLiking={setIsLiking} />
                  ) : (
                    <PostLike postId={postId} setIsLiking={setIsLiking} />
                  )}
                  <div>{postData.likes_id.length}</div>
                </div>

                <div className={styles.iconGroup}>
                  <Icon path={mdiCalendarMonthOutline} size={1} />
                  {new Date(postData.posting_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            {/* </Link> */}
          </div>
          {isOpenModal && (
            <div
              id="overlay"
              className={styles.overlay}
              onClick={handleOverlayClick}
            >
              <div className={styles.modal}>
                <PostEdit postId={postId} />
              </div>
            </div>
          )}
          {isOpenCommentCreate && (
            <div className={styles.commentCreate}>
              <CommentCreate postId={postId} />
            </div>
          )}
          {/* Todo: show real comment list under post */}
          {isOpenCommentList && <div>COMMENTLIST</div>}
        </>
      )}
    </>
  );
}
