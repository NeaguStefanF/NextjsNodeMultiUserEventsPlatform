import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { createPostComunity } from '../../actions/comunity';
import { getCookie, isAuth } from '../../actions/auth';
import { QuillModules, QuillFormats } from '../../helpers/quill';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import styles from '../comunity/Comunity.module.css';

const CreateComunityPost = ({ router }) => {
  // Grab the post from local storage
  const comunityFromLS = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    if (localStorage.getItem('comunity')) {
      return JSON.parse(localStorage.getItem('comunity'));
    } else {
      return false;
    }
  };

  // Get comunities from the database

  const [body, setBody] = useState(comunityFromLS());
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hidePublishButton: false,
  });

  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, [router]);

  // Create new comunity
  const publishPost = (e) => {
    e.preventDefault();
    // Perform validation checks
    if (!title || !title.length) {
      return setValues({ ...values, error: 'Title is required' });
    }

    if (!body) {
      return setValues({
        ...values,
        error: 'Content is missing',
      });
    }

    createPostComunity(formData, token)
      .then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else if (data && data.title) {
          setValues({
            ...values,
            title: '',
            error: '',
            success: `A new comunity titled "${data.title}" is created`,
          });
          setBody('');
          formData.delete('title'); // Clear form data
          formData.delete('body');
          // Reset success message after a delay
          setTimeout(() => {
            setValues({ ...values, success: '' });
            Router.reload();
          }, 500);
        }
      })
      .catch((error) => {
        console.error('Error creating comunity:', error);
      });
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('comunity', JSON.stringify(e));
    }
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

  const createComunityForm = () => {
    return (
      <form onSubmit={publishPost}>
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
            placeholder="Write here the content of the event..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-outline-dark mt-3">
            Publish Feedback Post
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className={`${styles.createComunityPost} container-fluid pt-1 pb-1`}>
      <div className="row">
        <div>
          {createComunityForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateComunityPost);
