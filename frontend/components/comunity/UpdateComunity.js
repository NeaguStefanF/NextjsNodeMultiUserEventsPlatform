import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router, { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getCookie, isAuth } from '../../actions/auth';
import { singlePost, updatePosts } from '../../actions/comunity';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';
import styles from '../comunity/Comunity.module.css';

const UpdateComunity = ({ router }) => {
  const [body, setBody] = useState('');

  const [values, setValues] = useState({
    error: '',
    success: '',
    formData: new FormData(),
    title: '',
    body: '',
  });

  const { error, success, formData, title } = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initPosts();
  }, [router]);

  const initPosts = () => {
    if (router.query.slug) {
      singlePost(router.query.slug).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else if (data) {
          setValues({ ...values, title: data.title });
          setBody(data.body);
        }
      });
    }
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set('body', e);
  };

  const editPost = (e) => {
    e.preventDefault();
    if (!title || !title.length) {
      return setValues({ ...values, error: 'Title is required' });
    }

    if (!body || body.length < 2) {
      return setValues({
        ...values,
        error: 'Content is shorter than 2 characters',
      });
    }

    updatePosts(formData, token, router.query.slug).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else if (data && data.title) {
        setValues({
          ...values,
          title: '',
          error: '',
          success: ` "${data.title}" is updated with success!`,
        });
        if (isAuth() && isAuth().role === 1) {
          Router.replace(`/admin/crudd/${router.query.slug}`);
        } else if (isAuth() && isAuth().role === 0) {
          Router.replace(`/user/crudd/${router.query.slug}`);
        }
        // Hide success message after 5 seconds
        setTimeout(() => {
          setValues({ ...values, success: '' });
        }, 5000);
      }
    });
  };

  const showError = () =>
    error && (
      <div className={`${styles.alert} ${styles['alert-danger']}`}>{error}</div>
    );

  const showSuccess = () =>
    success && (
      <div
        className="alert alert-success"
        style={{ display: success ? '' : 'none' }}
      >
        {success}
      </div>
    );

  const updatePostForm = () => {
    return (
      <form onSubmit={editPost}>
        <div className={`form-group ${styles['form-group-title']}`}>
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write here the content of the post..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary mt-3">
            Update Feedback Post
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="row justify-content-center">
        <div
          className={`${styles.createComunityPost} container-fluid pt-1 pb-1 col-md-8`}
        >
          {updatePostForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(UpdateComunity);
