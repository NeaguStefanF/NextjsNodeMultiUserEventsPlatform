import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createPost } from '../../actions/posts';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import styles from '../crud/Category.module.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';

const CreatePost = ({ router }) => {
  //grap the post from local storage
  const postFromLS = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    if (localStorage.getItem('posts')) {
      return JSON.parse(localStorage.getItem('posts'));
    } else {
      return false;
    }
  };

  //get categories and tags from bd
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  const [body, setBody] = useState(postFromLS());
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
    initCategories();
    initTags();
  }, [router]);

  //load categ, tags
  const initCategories = () => {
    getCategories().then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  //create new Post
  const publishPost = (e) => {
    e.preventDefault();
    // Perform validation checks
    if (!title || !title.length) {
      return setValues({ ...values, error: 'Title is required' });
    }

    if (!body || body.length < 200) {
      return setValues({
        ...values,
        error: 'Content is shorter than 200 characters',
      });
    }

    if (checked.length === 0) {
      return setValues({ ...values, error: 'You need one or more categories' });
    }

    if (checkedTag.length === 0) {
      return setValues({ ...values, error: 'You need one or more tags' });
    }
    createPost(formData, token)
      .then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else if (data && data.title) {
          setValues({
            ...values,
            title: '',
            error: '',
            success: `A new post titled "${data.title}" is created`,
          });
          setBody('');
          setChecked([]); // Reset checked categories
          setCheckedTag([]); // Reset checked tags
          formData.delete('title'); // Clear form data
          formData.delete('body');
          // Reset success message after a delay
          setTimeout(() => {
            setValues({ ...values, success: '' });
            Router.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };
  const handleBody = (e) => {
    // console.log(e);
    setBody(e);
    formData.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('posts', JSON.stringify(e));
    }
  };

  //checked checkbox Category
  const handleToggle = (c) => () => {
    setValues({ ...values, error: '' });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set('categories', all);
  };

  const handleTagsToggle = (t) => () => {
    setValues({ ...values, error: '' });
    // return the first index or -1
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            style={{ marginRight: '8px' }}
            onChange={handleToggle(c._id)}
            type="checkbox"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            style={{ marginRight: '8px' }}
            onChange={handleTagsToggle(t._id)}
            type="checkbox"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
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

  const createPostForm = () => {
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
            className={`${styles['ql-editor']}`}
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write here the content of the post..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary mt-3">
            Publish Event
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createPostForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group mb-3">
            <h5>Featured image</h5>
            <hr />
            <small style={{ display: 'block' }} className="text-muted mb-1">
              Max size: 1mb
            </small>
            <label className="btn btn-outline-info">
              Upload featured image
              <input
                onChange={handleChange('photo')}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreatePost);
