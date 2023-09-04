import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router, { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singlePost, updatePosts } from '../../actions/posts';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import styles from '../crud/Category.module.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';
import { API } from '../../config';

const UpdatePost = ({ router }) => {
  const [body, setBody] = useState('');

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

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
    initCategories();
    initTags();
  }, [router]);

  const initPosts = () => {
    if (router.query.slug) {
      singlePost(router.query.slug).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else if (data) {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (postsCategories) => {
    let ca = [];
    postsCategories.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };

  const setTagsArray = (postsTags) => {
    let ta = [];
    postsTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

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

  const findOutCategory = (c) => {
    const result = checked.indexOf(c); //if exist true else -1
    if (result !== -1) {
      return true;
    } else return false;
  };

  const findOutTags = (t) => {
    const result = checkedTag.indexOf(t); //if exist true else -1
    if (result !== -1) {
      return true;
    } else return false;
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            style={{ marginRight: '8px' }}
            onChange={handleToggle(c._id)}
            checked={findOutCategory(c._id)}
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
            checked={findOutTags(t._id)}
            type="checkbox"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
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
          Router.replace(`/admin/crud/${router.query.slug}`);
        } else if (isAuth() && isAuth().role === 0) {
          Router.replace(`/user/crud/${router.query.slug}`);
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
            Update Event
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updatePostForm()}
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
            {body && (
              <img
                src={`${API}/posts/photo/${router.query.slug}`}
                alt={title}
                style={{ width: '100%' }}
              />
            )}
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

export default withRouter(UpdatePost);
