import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removePosts } from '../../actions/posts';
import moment from 'moment';

const ReadPost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const token = getCookie('token');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    list(username).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const deletePost = (slug) => {
    removePosts(slug, token).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadPosts();
        setTimeout(() => {
          setMessage(''); // Clear the message after 10 seconds
        }, 10000);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this Post?');
    if (answer) {
      deletePost(slug);
    }
  };

  const showUpdateButton = (posts) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${posts.slug}`}>
          <span className="ms-2 btn btn-sm btn-warning">Update</span>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${posts.slug}`}>
          <span className="ms-2 btn btn-sm btn-warning">Update</span>
        </Link>
      );
    }
  };

  const showAllPosts = () => {
    if (!posts) {
      return null;
    }
    return posts.map((posts, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>{posts.title}</h3>
          <p className="mark">
            Written by {posts.postedBy.name} | Published on{' '}
            {moment(posts.updatedAt).fromNow()}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(posts.slug)}
          >
            Delete
          </button>
          {showUpdateButton(posts)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllPosts()}
        </div>
      </div>
    </>
  );
};

export default ReadPost;
