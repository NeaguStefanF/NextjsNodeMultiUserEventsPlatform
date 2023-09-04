import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { listcomunityposts, removePosts } from '../../actions/comunity';
import moment from 'moment';

const ReadComunity = ({ username }) => {
  const [comunity, setComunity] = useState([]);
  const [message, setMessage] = useState('');
  const token = getCookie('token');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    listcomunityposts(username).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setComunity(data);
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
          setMessage(''); // Clear the message after 3 seconds
        }, 3000);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this Post?');
    if (answer) {
      deletePost(slug);
    }
  };

  const showUpdateButton = (comunity) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crudd/${comunity.slug}`}>
          <span className="ms-2 btn btn-sm btn-warning">Update</span>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crudd/${comunity.slug}`}>
          <span className="ms-2 btn btn-sm btn-warning">Update</span>
        </Link>
      );
    }
  };

  const showAllPosts = () => {
    if (!comunity) {
      return null;
    }
    return comunity.map((comunity, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>{comunity.title}</h3>
          <p className="mark">
            Written by {comunity.postedBy.name} | Published on{' '}
            {moment(comunity.updatedAt).fromNow()}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(comunity.slug)}
          >
            Delete
          </button>
          {showUpdateButton(comunity)}
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

export default ReadComunity;
